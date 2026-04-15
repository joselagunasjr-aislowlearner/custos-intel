import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupabaseModule } from './common/supabase/supabase.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { PhotosModule } from './modules/photos/photos.module';
import { AnalysisModule } from './modules/analysis/analysis.module';
import { ChecklistModule } from './modules/checklist/checklist.module';
import { CodeReferenceModule } from './modules/code-reference/code-reference.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
    SupabaseModule,
    AuthModule,
    ProjectsModule,
    PhotosModule,
    AnalysisModule,
    ChecklistModule,
    CodeReferenceModule,
    ReportsModule,
  ],
})
export class AppModule {}
