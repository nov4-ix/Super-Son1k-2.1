/**
 * Token Pool Service
 * Manages the token pool for optimal performance
 */

import { PrismaClient } from '@prisma/client';
import { TokenManager } from './tokenManager';

export class TokenPoolService {
  private poolSize: number = 0;
  private healthyTokens: number = 0;
  private rotationInterval?: NodeJS.Timeout;
  private healthCheckInterval?: NodeJS.Timeout;

  constructor(
    private prisma: PrismaClient,
    private tokenManager: TokenManager
  ) {}

  /**
   * Initialize the token pool
   */
  async initialize(): Promise<void> {
    try {
      // Load initial pool size
      await this.updatePoolStats();

      // Start rotation interval
      this.startRotationInterval();

      // Start health check interval
      this.startHealthCheckInterval();

      console.log(`Token pool initialized with ${this.poolSize} tokens (${this.healthyTokens} healthy)`);
    } catch (error) {
      console.error('Failed to initialize token pool:', error);
      throw error;
    }
  }

  /**
   * Get current pool size
   */
  async getPoolSize(): Promise<number> {
    await this.updatePoolStats();
    return this.poolSize;
  }

  /**
   * Get healthy token count
   */
  async getHealthyTokenCount(): Promise<number> {
    await this.updatePoolStats();
    return this.healthyTokens;
  }

  /**
   * Update pool statistics
   */
  private async updatePoolStats(): Promise<void> {
    try {
      const [totalTokens, healthyTokens] = await Promise.all([
        this.prisma.token.count({
          where: { isActive: true }
        }),
        this.prisma.token.count({
          where: { isActive: true, isValid: true }
        })
      ]);

      this.poolSize = totalTokens;
      this.healthyTokens = healthyTokens;
    } catch (error) {
      console.error('Failed to update pool stats:', error);
    }
  }

  /**
   * Start token rotation interval
   */
  private startRotationInterval(): void {
    const interval = parseInt(process.env.ROTATION_INTERVAL || '300000'); // 5 minutes default

    this.rotationInterval = setInterval(async () => {
      await this.performTokenRotation();
    }, interval);
  }

  /**
   * Start health check interval
   */
  private startHealthCheckInterval(): void {
    const interval = parseInt(process.env.HEALTH_CHECK_INTERVAL || '60000'); // 1 minute default

    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, interval);
  }

  /**
   * Perform token rotation
   */
  private async performTokenRotation(): Promise<void> {
    try {
      // Get tokens that need rotation
      const tokensToRotate = await this.prisma.token.findMany({
        where: {
          isActive: true,
          isValid: true,
          OR: [
            { lastUsed: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }, // Not used in 24h
            { usageCount: { gt: 1000 } } // High usage
          ]
        },
        take: 5 // Rotate max 5 tokens at a time
      });

      for (const token of tokensToRotate) {
        // Mark token for rotation (deactivate temporarily)
        await this.prisma.token.update({
          where: { id: token.id },
          data: { isActive: false }
        });

        // Wait a bit before reactivating
        setTimeout(async () => {
          await this.prisma.token.update({
            where: { id: token.id },
            data: { 
              isActive: true,
              usageCount: 0,
              lastUsed: null
            }
          });
        }, 30000); // 30 seconds
      }

      if (tokensToRotate.length > 0) {
        console.log(`Rotated ${tokensToRotate.length} tokens`);
      }

    } catch (error) {
      console.error('Token rotation failed:', error);
    }
  }

  /**
   * Perform health check on token pool
   */
  private async performHealthCheck(): Promise<void> {
    try {
      const isHealthy = await this.tokenManager.performHealthCheck();
      
      if (!isHealthy) {
        console.warn('Token pool health check failed');
      }

      // Update pool stats
      await this.updatePoolStats();

      // Log pool status
      if (this.poolSize > 0) {
        const healthPercentage = (this.healthyTokens / this.poolSize) * 100;
        
        if (healthPercentage < 50) {
          console.warn(`Token pool health is low: ${healthPercentage.toFixed(1)}% (${this.healthyTokens}/${this.poolSize})`);
        }
      }

    } catch (error) {
      console.error('Token pool health check failed:', error);
    }
  }

  /**
   * Get pool statistics
   */
  async getPoolStatistics() {
    try {
      await this.updatePoolStats();

      const stats = await this.tokenManager.getPoolStats();

      return {
        poolSize: this.poolSize,
        healthyTokens: this.healthyTokens,
        healthPercentage: this.poolSize > 0 ? (this.healthyTokens / this.poolSize) * 100 : 0,
        totalTokens: stats.totalTokens,
        activeTokens: stats.activeTokens,
        averageResponseTime: stats.averageResponseTime,
        totalRequests: stats.totalRequests,
        successRate: stats.successRate
      };

    } catch (error) {
      console.error('Failed to get pool statistics:', error);
      throw error;
    }
  }

  /**
   * Add tokens to pool
   */
  async addTokensToPool(tokens: string[], userId?: string, email?: string, tier: 'FREE' | 'PREMIUM' | 'ENTERPRISE' = 'FREE') {
    try {
      const addedTokens: string[] = [];

      for (const token of tokens) {
        try {
          const tokenId = await this.tokenManager.addToken(token, userId, email, tier);
          addedTokens.push(tokenId);
        } catch (error) {
          console.error(`Failed to add token: ${error}`);
        }
      }

      // Update pool stats
      await this.updatePoolStats();

      return {
        added: addedTokens.length,
        failed: tokens.length - addedTokens.length,
        tokenIds: addedTokens
      };

    } catch (error) {
      console.error('Failed to add tokens to pool:', error);
      throw error;
    }
  }

  /**
   * Remove tokens from pool
   */
  async removeTokensFromPool(tokenIds: string[]) {
    try {
      let removedCount = 0;

      for (const tokenId of tokenIds) {
        const success = await this.tokenManager.removeToken(tokenId);
        if (success) removedCount++;
      }

      // Update pool stats
      await this.updatePoolStats();

      return {
        removed: removedCount,
        failed: tokenIds.length - removedCount
      };

    } catch (error) {
      console.error('Failed to remove tokens from pool:', error);
      throw error;
    }
  }

  /**
   * Cleanup expired tokens
   */
  async cleanupExpiredTokens(): Promise<number> {
    try {
      const expiredTokens = await this.prisma.token.findMany({
        where: {
          expiresAt: {
            lt: new Date()
          },
          isActive: true
        }
      });

      let cleanedCount = 0;
      for (const token of expiredTokens) {
        const success = await this.tokenManager.removeToken(token.id);
        if (success) cleanedCount++;
      }

      // Update pool stats
      await this.updatePoolStats();

      if (cleanedCount > 0) {
        console.log(`Cleaned up ${cleanedCount} expired tokens`);
      }

      return cleanedCount;

    } catch (error) {
      console.error('Failed to cleanup expired tokens:', error);
      return 0;
    }
  }

  /**
   * Get pool health status
   */
  async getPoolHealth(): Promise<{
    isHealthy: boolean;
    healthPercentage: number;
    poolSize: number;
    healthyTokens: number;
    issues: string[];
  }> {
    try {
      await this.updatePoolStats();

      const issues: string[] = [];
      const healthPercentage = this.poolSize > 0 ? (this.healthyTokens / this.poolSize) * 100 : 0;

      if (this.poolSize === 0) {
        issues.push('No tokens in pool');
      } else if (this.healthyTokens === 0) {
        issues.push('No healthy tokens available');
      } else if (healthPercentage < 50) {
        issues.push('Low token pool health');
      }

      const isHealthy = issues.length === 0;

      return {
        isHealthy,
        healthPercentage,
        poolSize: this.poolSize,
        healthyTokens: this.healthyTokens,
        issues
      };

    } catch (error) {
      console.error('Failed to get pool health:', error);
      return {
        isHealthy: false,
        healthPercentage: 0,
        poolSize: 0,
        healthyTokens: 0,
        issues: ['Failed to check pool health']
      };
    }
  }

  /**
   * Close service and cleanup
   */
  async close(): Promise<void> {
    try {
      if (this.rotationInterval) {
        clearInterval(this.rotationInterval);
      }

      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
      }

      console.log('Token pool service closed');
    } catch (error) {
      console.error('Failed to close token pool service:', error);
    }
  }
}
