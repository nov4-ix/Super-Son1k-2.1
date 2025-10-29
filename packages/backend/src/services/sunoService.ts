/**
 * Suno Service
 * Handles integration with Suno AI API for music generation
 */

import { TokenManager } from './tokenManager';
import axios, { AxiosInstance } from 'axios';

export interface GenerationRequest {
  prompt: string;
  style: string;
  duration: number;
  quality: string;
  userId: string;
  generationId: string;
}

export interface GenerationResult {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  sunoId?: string;
  audioUrl?: string;
  metadata?: any;
  estimatedTime?: number;
  error?: string;
}

export class SunoService {
  private axiosInstances: Map<string, AxiosInstance> = new Map();

  constructor(private tokenManager: TokenManager) {}

  /**
   * Generate music using Suno API
   */
  async generateMusic(request: GenerationRequest): Promise<GenerationResult> {
    try {
      // Get a healthy token
      const tokenData = await this.tokenManager.getHealthyToken(request.userId);
      
      if (!tokenData) {
        return {
          status: 'failed',
          error: 'No available tokens'
        };
      }

      // Create axios instance for this request
      const axiosInstance = this.createAxiosInstance(tokenData.token);

      // Prepare generation request
      const generationData = {
        prompt: request.prompt,
        style: request.style,
        duration: request.duration,
        quality: request.quality,
        custom_mode: false,
        tags: this.generateTags(request.style)
      };

      // Make request to Suno API
      const response = await axiosInstance.post('/generate', generationData, {
        timeout: 30000
      });

      if (response.status === 200 && response.data) {
        const sunoId = response.data.id || response.data.task_id;
        
        // Update token usage
        await this.tokenManager.updateTokenUsage(tokenData.tokenId, {
          endpoint: '/generate',
          method: 'POST',
          statusCode: response.status,
          responseTime: response.data.responseTime || 0,
          timestamp: new Date()
        });

        return {
          status: 'pending',
          sunoId,
          estimatedTime: this.estimateGenerationTime(request.duration, request.quality)
        };
      } else {
        return {
          status: 'failed',
          error: 'Invalid response from Suno API'
        };
      }

    } catch (error) {
      console.error('Suno generation error:', error);
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check generation status
   */
  async checkGenerationStatus(sunoId: string): Promise<GenerationResult> {
    try {
      // Get a healthy token
      const tokenData = await this.tokenManager.getHealthyToken();
      
      if (!tokenData) {
        return {
          status: 'failed',
          error: 'No available tokens'
        };
      }

      const axiosInstance = this.createAxiosInstance(tokenData.token);

      // Check status
      const response = await axiosInstance.get(`/status/${sunoId}`, {
        timeout: 10000
      });

      if (response.status === 200 && response.data) {
        const data = response.data;
        
        // Update token usage
        await this.tokenManager.updateTokenUsage(tokenData.tokenId, {
          endpoint: `/status/${sunoId}`,
          method: 'GET',
          statusCode: response.status,
          responseTime: data.responseTime || 0,
          timestamp: new Date()
        });

        if (data.status === 'completed' && data.audio_url) {
          return {
            status: 'completed',
            sunoId,
            audioUrl: data.audio_url,
            metadata: {
              duration: data.duration,
              style: data.style,
              quality: data.quality,
              tags: data.tags,
              createdAt: data.created_at
            }
          };
        } else if (data.status === 'processing') {
          return {
            status: 'processing',
            sunoId,
            estimatedTime: data.estimated_time || 60
          };
        } else if (data.status === 'failed') {
          return {
            status: 'failed',
            sunoId,
            error: data.error || 'Generation failed'
          };
        } else {
          return {
            status: 'pending',
            sunoId,
            estimatedTime: data.estimated_time || 60
          };
        }
      } else {
        return {
          status: 'failed',
          error: 'Invalid response from Suno API'
        };
      }

    } catch (error) {
      console.error('Status check error:', error);
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Create axios instance for Suno API
   */
  private createAxiosInstance(token: string): AxiosInstance {
    return axios.create({
      baseURL: process.env.SUNO_API_URL || 'https://api.suno.ai/v1',
      timeout: 30000,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Super-Son1k-2.0/2.0',
        'X-Client-Version': '2.0.0'
      }
    });
  }

  /**
   * Generate tags based on style
   */
  private generateTags(style: string): string[] {
    const styleTags: Record<string, string[]> = {
      'pop': ['pop', 'catchy', 'melodic'],
      'rock': ['rock', 'guitar', 'energetic'],
      'hip-hop': ['hip-hop', 'rap', 'urban'],
      'electronic': ['electronic', 'synth', 'dance'],
      'jazz': ['jazz', 'smooth', 'sophisticated'],
      'classical': ['classical', 'orchestral', 'elegant'],
      'country': ['country', 'folk', 'acoustic'],
      'blues': ['blues', 'soulful', 'emotional'],
      'reggae': ['reggae', 'tropical', 'laid-back'],
      'metal': ['metal', 'heavy', 'aggressive']
    };

    return styleTags[style.toLowerCase()] || ['original', 'unique'];
  }

  /**
   * Estimate generation time based on duration and quality
   */
  private estimateGenerationTime(duration: number, quality: string): number {
    let baseTime = duration * 2; // Base 2x duration
    
    // Adjust based on quality
    switch (quality.toLowerCase()) {
      case 'standard':
        baseTime *= 1;
        break;
      case 'high':
        baseTime *= 1.5;
        break;
      case 'premium':
        baseTime *= 2;
        break;
      case 'enterprise':
        baseTime *= 2.5;
        break;
      default:
        baseTime *= 1;
    }

    // Minimum 30 seconds, maximum 10 minutes
    return Math.max(30, Math.min(600, baseTime));
  }

  /**
   * Health check for Suno service
   */
  async healthCheck(): Promise<boolean> {
    try {
      const tokenData = await this.tokenManager.getHealthyToken();
      
      if (!tokenData) {
        return false;
      }

      const axiosInstance = this.createAxiosInstance(tokenData.token);
      
      // Simple health check
      const response = await axiosInstance.get('/health', {
        timeout: 5000
      });

      return response.status === 200;
    } catch (error) {
      console.error('Suno health check failed:', error);
      return false;
    }
  }

  /**
   * Close service and cleanup
   */
  async close() {
    // Close all axios instances
    this.axiosInstances.clear();
  }
}
