import { Injectable, Logger } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';

export interface VisionAnalysisResult {
  title: string;
  finding_type: 'compliant' | 'non_compliant' | 'needs_review' | 'informational';
  description: string;
  code_references: Array<{ code: string; requirement: string }>;
  confidence: number;
}

@Injectable()
export class ClaudeVisionService {
  private readonly client: Anthropic;
  private readonly logger = new Logger(ClaudeVisionService.name);
  private readonly model = 'claude-sonnet-4-20250514';

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async analyzeImage(
    imageBuffer: Buffer,
    mimeType: string,
    systemPrompt: string,
  ): Promise<VisionAnalysisResult[]> {
    const mediaType = this.normalizeMediaType(mimeType);
    const base64 = imageBuffer.toString('base64');

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64,
                },
              },
              {
                type: 'text',
                text: 'Analyze this building plan photo for fire code compliance. Return your findings as a JSON array.',
              },
            ],
          },
        ],
      });

      const textContent = response.content.find((c) => c.type === 'text');
      if (!textContent || textContent.type !== 'text') {
        return [];
      }

      // Extract JSON from response
      const jsonMatch = textContent.text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        this.logger.warn('No JSON array found in Claude response');
        return [];
      }

      return JSON.parse(jsonMatch[0]) as VisionAnalysisResult[];
    } catch (error) {
      this.logger.error(`Claude Vision analysis failed: ${error}`);
      throw error;
    }
  }

  private normalizeMediaType(
    mimeType: string,
  ): 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' {
    const map: Record<string, 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'> = {
      'image/jpeg': 'image/jpeg',
      'image/jpg': 'image/jpeg',
      'image/png': 'image/png',
      'image/gif': 'image/gif',
      'image/webp': 'image/webp',
      'image/heic': 'image/jpeg', // HEIC gets converted before upload typically
    };
    return map[mimeType] || 'image/jpeg';
  }
}
