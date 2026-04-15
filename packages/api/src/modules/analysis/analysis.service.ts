import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalysisFinding } from './analysis-finding.entity';
import { ClaudeVisionService } from './claude-vision.service';
import { StorageService } from '../photos/storage.service';
import { PhotosService } from '../photos/photos.service';
import { ProjectsService } from '../projects/projects.service';
import { CodeReferenceService } from '../code-reference/code-reference.service';
import { buildSystemPrompt } from './prompts/code-context-builder';

const CATEGORIES = ['sprinkler', 'fire_access', 'fdc_standpipe', 'fire_life_safety'];

@Injectable()
export class AnalysisService {
  private readonly logger = new Logger(AnalysisService.name);

  constructor(
    @InjectRepository(AnalysisFinding)
    private readonly findingRepo: Repository<AnalysisFinding>,
    private readonly claude: ClaudeVisionService,
    private readonly storage: StorageService,
    private readonly photos: PhotosService,
    private readonly projects: ProjectsService,
    private readonly codeRefs: CodeReferenceService,
  ) {}

  async findByProject(projectId: string): Promise<AnalysisFinding[]> {
    return this.findingRepo.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
    });
  }

  async analyzePhoto(
    photoId: string,
    userId: string,
  ): Promise<AnalysisFinding[]> {
    const photo = await this.photos.findOne(photoId);
    const project = await this.projects.findOne(photo.projectId, userId);

    const imageBuffer = await this.storage.download(photo.storagePath);
    const allFindings: AnalysisFinding[] = [];

    for (const category of CATEGORIES) {
      try {
        const refs = await this.codeRefs.findByCategory(this.mapCategoryToSource(category));
        const systemPrompt = buildSystemPrompt(project, category, refs);

        const results = await this.claude.analyzeImage(
          imageBuffer,
          photo.mimeType || 'image/jpeg',
          systemPrompt,
        );

        for (const result of results) {
          const finding = this.findingRepo.create({
            projectId: project.id,
            photoId: photo.id,
            category,
            findingType: result.finding_type,
            title: result.title,
            description: result.description,
            codeReferences: result.code_references,
            confidence: result.confidence,
            aiModel: 'claude-sonnet-4-20250514',
            rawAiResponse: JSON.stringify(result),
          });
          allFindings.push(await this.findingRepo.save(finding));
        }
      } catch (error) {
        this.logger.error(`Analysis failed for category ${category}: ${error}`);
      }
    }

    return allFindings;
  }

  async analyzeProject(
    projectId: string,
    userId: string,
  ): Promise<AnalysisFinding[]> {
    const project = await this.projects.findOne(projectId, userId);
    const photos = await this.photos.findByProject(projectId);

    if (photos.length === 0) {
      throw new NotFoundException('No photos to analyze');
    }

    const allFindings: AnalysisFinding[] = [];
    for (const photo of photos) {
      const findings = await this.analyzePhoto(photo.id, userId);
      allFindings.push(...findings);
    }

    return allFindings;
  }

  private mapCategoryToSource(category: string): string {
    const map: Record<string, string> = {
      sprinkler: 'sprinkler_spacing',
      fire_access: 'fire_access',
      fdc_standpipe: 'fdc_requirements',
      fire_life_safety: 'fire_life_safety',
    };
    return map[category] || category;
  }
}
