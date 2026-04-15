import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalysisFinding } from './analysis-finding.entity';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { ClaudeVisionService } from './claude-vision.service';
import { PhotosModule } from '../photos/photos.module';
import { ProjectsModule } from '../projects/projects.module';
import { CodeReferenceModule } from '../code-reference/code-reference.module';
import { User } from '../auth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnalysisFinding, User]),
    PhotosModule,
    ProjectsModule,
    CodeReferenceModule,
  ],
  controllers: [AnalysisController],
  providers: [AnalysisService, ClaudeVisionService],
  exports: [AnalysisService],
})
export class AnalysisModule {}
