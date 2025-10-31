/**
 * Generation Routes
 * Handles music generation requests with Suno API integration
 */

import { FastifyInstance } from 'fastify';
import { SunoService } from '../services/sunoService';
import { AnalyticsService } from '../services/analyticsService';
import { authMiddleware, quotaMiddleware } from '../middleware/auth';

export function generationRoutes(sunoService: SunoService, analyticsService: AnalyticsService) {
  return async function(fastify: FastifyInstance) {
    // Generate music with Suno API
    fastify.post('/create', {
      preHandler: [authMiddleware, quotaMiddleware]
    }, async (request, reply) => {
      const user = (request as any).user;
      const { prompt, style, duration, quality } = request.body as any;

      try {
        // Validate input
        if (!prompt || typeof prompt !== 'string') {
          return reply.code(400).send({
            success: false,
            error: {
              code: 'INVALID_PROMPT',
              message: 'Prompt is required and must be a string'
            }
          });
        }

        // Check user limits
        const quotaInfo = (request as any).quotaInfo;
        if (quotaInfo.remainingGenerations <= 0) {
          return reply.code(403).send({
            success: false,
            error: {
              code: 'QUOTA_EXCEEDED',
              message: 'Monthly generation quota exceeded'
            }
          });
        }

        // Create generation record
        const generation = await fastify.prisma.generation.create({
          data: {
            userId: user.id,
            prompt,
            style: style || 'pop',
            duration: duration || 60,
            quality: quality || 'standard',
            status: 'pending'
          }
        });

        // Track analytics
        await analyticsService.trackGeneration({
          userId: user.id,
          generationId: generation.id,
          prompt,
          style,
          duration,
          quality,
          timestamp: new Date()
        });

        // Start generation process
        const result = await sunoService.generateMusic({
          prompt,
          style: style || 'pop',
          duration: duration || 60,
          quality: quality || 'standard',
          userId: user.id,
          generationId: generation.id
        });

        // Update generation record
        await fastify.prisma.generation.update({
          where: { id: generation.id },
          data: {
            status: result.status,
            sunoId: result.sunoId,
            audioUrl: result.audioUrl,
            metadata: result.metadata
          }
        });

        // Update user usage
        await fastify.prisma.userTier.update({
          where: { userId: user.id },
          data: {
            usedThisMonth: { increment: 1 },
            usedToday: { increment: 1 }
          }
        });

        return {
          success: true,
          data: {
            generationId: generation.id,
            status: result.status,
            sunoId: result.sunoId,
            audioUrl: result.audioUrl,
            estimatedTime: result.estimatedTime
          }
        };

      } catch (error) {
        console.error('Generation error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'GENERATION_FAILED',
            message: 'Failed to generate music'
          }
        });
      }
    });

    // Get generation status
    fastify.get('/:generationId/status', {
      preHandler: [authMiddleware]
    }, async (request, reply) => {
      const user = (request as any).user;
      const { generationId } = request.params as any;

      try {
        const generation = await fastify.prisma.generation.findFirst({
          where: {
            id: generationId,
            userId: user.id
          }
        });

        if (!generation) {
          return reply.code(404).send({
            success: false,
            error: {
              code: 'GENERATION_NOT_FOUND',
              message: 'Generation not found'
            }
          });
        }

        // Check status with Suno API if still pending
        if (generation.status === 'pending' && generation.sunoId) {
          const status = await sunoService.checkGenerationStatus(generation.sunoId);
          
          if (status.status !== generation.status) {
            await fastify.prisma.generation.update({
              where: { id: generation.id },
              data: {
                status: status.status,
                audioUrl: status.audioUrl,
                metadata: status.metadata
              }
            });

            generation.status = status.status;
            generation.audioUrl = status.audioUrl;
            generation.metadata = status.metadata;
          }
        }

        return {
          success: true,
          data: {
            id: generation.id,
            status: generation.status,
            prompt: generation.prompt,
            style: generation.style,
            duration: generation.duration,
            quality: generation.quality,
            audioUrl: generation.audioUrl,
            metadata: generation.metadata,
            createdAt: generation.createdAt,
            updatedAt: generation.updatedAt
          }
        };

      } catch (error) {
        console.error('Status check error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'STATUS_CHECK_FAILED',
            message: 'Failed to check generation status'
          }
        });
      }
    });

    // Get user generations
    fastify.get('/history', {
      preHandler: [authMiddleware]
    }, async (request, reply) => {
      const user = (request as any).user;
      const { page = 1, limit = 20 } = request.query as any;

      try {
        const skip = (page - 1) * limit;

        const [generations, total] = await Promise.all([
          fastify.prisma.generation.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            select: {
              id: true,
              prompt: true,
              style: true,
              duration: true,
              quality: true,
              status: true,
              audioUrl: true,
              createdAt: true,
              updatedAt: true
            }
          }),
          fastify.prisma.generation.count({
            where: { userId: user.id }
          })
        ]);

        return {
          success: true,
          data: {
            generations,
            pagination: {
              page,
              limit,
              total,
              pages: Math.ceil(total / limit)
            }
          }
        };

      } catch (error) {
        console.error('History fetch error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'HISTORY_FETCH_FAILED',
            message: 'Failed to fetch generation history'
          }
        });
      }
    });

    // Delete generation
    fastify.delete('/:generationId', {
      preHandler: [authMiddleware]
    }, async (request, reply) => {
      const user = (request as any).user;
      const { generationId } = request.params as any;

      try {
        const generation = await fastify.prisma.generation.findFirst({
          where: {
            id: generationId,
            userId: user.id
          }
        });

        if (!generation) {
          return reply.code(404).send({
            success: false,
            error: {
              code: 'GENERATION_NOT_FOUND',
              message: 'Generation not found'
            }
          });
        }

        await fastify.prisma.generation.delete({
          where: { id: generationId }
        });

        return {
          success: true,
          data: {
            message: 'Generation deleted successfully'
          }
        };

      } catch (error) {
        console.error('Delete error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'DELETE_FAILED',
            message: 'Failed to delete generation'
          }
        });
      }
    });
  };
}
