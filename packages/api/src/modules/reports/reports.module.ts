import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ProjectsModule } from '../projects/projects.module';
import { ChecklistModule } from '../checklist/checklist.module';
import { AnalysisModule } from '../analysis/analysis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ProjectsModule,
    ChecklistModule,
    AnalysisModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
