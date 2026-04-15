import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Project } from '../projects/project.entity';
import { PlanPhoto } from '../photos/plan-photo.entity';

@Entity('ci_analysis_findings')
export class AnalysisFinding {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'project_id' })
  projectId!: string;

  @ManyToOne(() => Project, (project) => project.findings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ name: 'photo_id', nullable: true })
  photoId!: string | null;

  @ManyToOne(() => PlanPhoto, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'photo_id' })
  photo!: PlanPhoto | null;

  @Column()
  category!: string;

  @Column({ name: 'finding_type' })
  findingType!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ name: 'code_references', type: 'jsonb', default: '[]' })
  codeReferences!: Array<{ code: string; requirement: string }>;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  confidence!: number | null;

  @Column({ name: 'ai_model', nullable: true })
  aiModel!: string | null;

  @Column({ name: 'raw_ai_response', type: 'text', nullable: true })
  rawAiResponse!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
