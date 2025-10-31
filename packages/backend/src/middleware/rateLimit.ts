import { FastifyRequest, FastifyReply } from 'fastify'
import Redis from 'ioredis'
import { AuthenticatedRequest } from './auth'

// Redis client for rate limiting
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
})

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  keyPrefix: string
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  FREE: { maxRequests: 10, windowMs: 60000, keyPrefix: 'rate_limit:free' },
  PRO: { maxRequests: 50, windowMs: 60000, keyPrefix: 'rate_limit:pro' },
  PREMIUM: { maxRequests: 200, windowMs: 60000, keyPrefix: 'rate_limit:premium' },
  ENTERPRISE: { maxRequests: 1000, windowMs: 60000, keyPrefix: 'rate_limit:enterprise' },
  GLOBAL: { maxRequests: 100, windowMs: 60000, keyPrefix: 'rate_limit:global' },
}

export async function rateLimitMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = (request as AuthenticatedRequest).user
    const ip = request.ip || 'unknown'
    
    // Determine rate limit config
    let config: RateLimitConfig
    let key: string
    
    if (user) {
      const tier = user.tier || 'FREE'
      config = RATE_LIMITS[tier] || RATE_LIMITS.FREE
      key = `${config.keyPrefix}:user:${user.id}`
    } else {
      config = RATE_LIMITS.GLOBAL
      key = `${config.keyPrefix}:ip:${ip}`
    }
    
    // Check current count
    const currentCount = await redis.get(key)
    const count = currentCount ? parseInt(currentCount) : 0
    
    if (count >= config.maxRequests) {
      // Get TTL to calculate retry after
      const ttl = await redis.ttl(key)
      const retryAfter = ttl > 0 ? ttl : Math.ceil(config.windowMs / 1000)
      
      reply.header('Retry-After', retryAfter)
      reply.header('X-RateLimit-Limit', config.maxRequests)
      reply.header('X-RateLimit-Remaining', 0)
      reply.header('X-RateLimit-Reset', Math.ceil((Date.now() + config.windowMs) / 1000))
      
      return reply.status(429).send({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        retryAfter
      })
    }
    
    // Increment counter
    if (count === 0) {
      await redis.setex(key, Math.ceil(config.windowMs / 1000), '1')
    } else {
      await redis.incr(key)
    }
    
    // Set rate limit headers
    reply.header('X-RateLimit-Limit', config.maxRequests)
    reply.header('X-RateLimit-Remaining', config.maxRequests - count - 1)
    reply.header('X-RateLimit-Reset', Math.ceil((Date.now() + config.windowMs) / 1000))
    
  } catch (error) {
    console.error('Rate limiting error:', error)
    // If Redis fails, allow the request but log the error
    // In production, you might want to fail closed
  }
}

// Cleanup function for graceful shutdown
export async function cleanupRateLimit() {
  await redis.quit()
}