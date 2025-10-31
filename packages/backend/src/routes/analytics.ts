/**
 * Analytics Routes
 * Handles analytics and monitoring endpoints
 */

import { FastifyInstance } from 'fastify';
import { AnalyticsService } from '../services/analyticsService';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

export function analyticsRoutes(fastify: FastifyInstance, analyticsService: AnalyticsService) {
  return async function() {
    // Get user analytics
    fastify.get('/user', {
      preHandler: [authMiddleware]
    }, async (request, reply) => {
      const user = (request as any).user;
      const { period = '30d' } = request.query as any;

      try {
        const analytics = await analyticsService.getUserAnalytics(user.id, period);

        return {
          success: true,
          data: analytics
        };

      } catch (error) {
        console.error('User analytics error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'ANALYTICS_FETCH_FAILED',
            message: 'Failed to fetch user analytics'
          }
        });
      }
    });

    // Get generation analytics
    fastify.get('/generations', {
      preHandler: [authMiddleware]
    }, async (request, reply) => {
      const user = (request as any).user;
      const { period = '30d' } = request.query as any;

      try {
        const analytics = await analyticsService.getGenerationAnalytics(user.id, period);

        return {
          success: true,
          data: analytics
        };

      } catch (error) {
        console.error('Generation analytics error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'GENERATION_ANALYTICS_FAILED',
            message: 'Failed to fetch generation analytics'
          }
        });
      }
    });

    // Get token usage analytics
    fastify.get('/tokens', {
      preHandler: [authMiddleware]
    }, async (request, reply) => {
      const user = (request as any).user;
      const { period = '30d' } = request.query as any;

      try {
        const analytics = await analyticsService.getTokenAnalytics(user.id, period);

        return {
          success: true,
          data: analytics
        };

      } catch (error) {
        console.error('Token analytics error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'TOKEN_ANALYTICS_FAILED',
            message: 'Failed to fetch token analytics'
          }
        });
      }
    });

    // Admin: Get system analytics
    fastify.get('/admin/system', {
      preHandler: [adminMiddleware]
    }, async (request, reply) => {
      const { period = '30d' } = request.query as any;

      try {
        const analytics = await analyticsService.getSystemAnalytics(period);

        return {
          success: true,
          data: analytics
        };

      } catch (error) {
        console.error('System analytics error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'SYSTEM_ANALYTICS_FAILED',
            message: 'Failed to fetch system analytics'
          }
        });
      }
    });

    // Admin: Get user statistics
    fastify.get('/admin/users', {
      preHandler: [adminMiddleware]
    }, async (request, reply) => {
      const { period = '30d' } = request.query as any;

      try {
        const analytics = await analyticsService.getUserStatistics(period);

        return {
          success: true,
          data: analytics
        };

      } catch (error) {
        console.error('User statistics error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'USER_STATISTICS_FAILED',
            message: 'Failed to fetch user statistics'
          }
        });
      }
    });

    // Admin: Get generation statistics
    fastify.get('/admin/generations', {
      preHandler: [adminMiddleware]
    }, async (request, reply) => {
      const { period = '30d' } = request.query as any;

      try {
        const analytics = await analyticsService.getGenerationStatistics(period);

        return {
          success: true,
          data: analytics
        };

      } catch (error) {
        console.error('Generation statistics error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'GENERATION_STATISTICS_FAILED',
            message: 'Failed to fetch generation statistics'
          }
        });
      }
    });

    // Admin: Get token pool statistics
    fastify.get('/admin/tokens', {
      preHandler: [adminMiddleware]
    }, async (request, reply) => {
      try {
        const analytics = await analyticsService.getTokenPoolStatistics();

        return {
          success: true,
          data: analytics
        };

      } catch (error) {
        console.error('Token pool statistics error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'TOKEN_POOL_STATISTICS_FAILED',
            message: 'Failed to fetch token pool statistics'
          }
        });
      }
    });

    // Admin: Get performance metrics
    fastify.get('/admin/performance', {
      preHandler: [adminMiddleware]
    }, async (request, reply) => {
      const { period = '24h' } = request.query as any;

      try {
        const analytics = await analyticsService.getPerformanceMetrics(period);

        return {
          success: true,
          data: analytics
        };

      } catch (error) {
        console.error('Performance metrics error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'PERFORMANCE_METRICS_FAILED',
            message: 'Failed to fetch performance metrics'
          }
        });
      }
    });

    // Track custom event
    fastify.post('/track', {
      preHandler: [authMiddleware]
    }, async (request, reply) => {
      const user = (request as any).user;
      const { event, properties } = request.body as any;

      try {
        if (!event) {
          return reply.code(400).send({
            success: false,
            error: {
              code: 'EVENT_REQUIRED',
              message: 'Event name is required'
            }
          });
        }

        await analyticsService.trackEvent({
          userId: user.id,
          event,
          properties: properties || {},
          timestamp: new Date()
        });

        return {
          success: true,
          data: {
            message: 'Event tracked successfully'
          }
        };

      } catch (error) {
        console.error('Event tracking error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'EVENT_TRACKING_FAILED',
            message: 'Failed to track event'
          }
        });
      }
    });

    // Get real-time metrics
    fastify.get('/realtime', {
      preHandler: [adminMiddleware]
    }, async (request, reply) => {
      try {
        const metrics = await analyticsService.getRealtimeMetrics();

        return {
          success: true,
          data: metrics
        };

      } catch (error) {
        console.error('Realtime metrics error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'REALTIME_METRICS_FAILED',
            message: 'Failed to fetch realtime metrics'
          }
        });
      }
    });
  };
}
