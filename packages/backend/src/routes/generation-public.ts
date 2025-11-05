/**
 * Public Generation Routes
 * Endpoints without authentication for frontend apps like Ghost Studio
 */

import { FastifyInstance } from 'fastify';
import { SunoService } from '../services/sunoService';
import { AnalyticsService } from '../services/analyticsService';

export function publicGenerationRoutes(sunoService: SunoService, analyticsService: AnalyticsService) {
  return async function(fastify: FastifyInstance) {
    // ✅ PUBLIC: Generate music without auth (for Ghost Studio and similar apps)
    fastify.post('/create', async (request, reply) => {
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

        // Create generation record (without userId - public generation)
        const generation = await fastify.prisma.generation.create({
          data: {
            userId: null, // Public generation
            prompt,
            style: style || 'pop',
            duration: duration || 60,
            quality: quality || 'standard',
            status: 'pending'
          }
        });

        // Track analytics (without userId - optional)
        try {
          await analyticsService.trackGeneration({
            userId: undefined, // Analytics service should handle optional userId
            generationId: generation.id,
            prompt,
            style,
            duration,
            quality,
            timestamp: new Date()
          });
        } catch (analyticsError) {
          // Analytics failure shouldn't block generation
          console.warn('Analytics tracking failed for public generation:', analyticsError);
        }

        // Start generation process
        const result = await sunoService.generateMusic({
          prompt,
          style: style || 'pop',
          duration: duration || 60,
          quality: quality || 'standard',
          userId: null,
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
        console.error('Public generation error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'GENERATION_FAILED',
            message: 'Failed to generate music'
          }
        });
      }
    });

    // ✅ PUBLIC: Get generation status (without auth)
    fastify.get('/:generationId/status', async (request, reply) => {
      const { generationId } = request.params as any;

      try {
        const generation = await fastify.prisma.generation.findFirst({
          where: {
            id: generationId,
            userId: null // Only public generations
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
        console.error('Public status check error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'STATUS_CHECK_FAILED',
            message: 'Failed to check generation status'
          }
        });
      }
    });
  };
}

