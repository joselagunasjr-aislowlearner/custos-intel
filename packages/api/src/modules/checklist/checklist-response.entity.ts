import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from '../projects/project.entity';
import { ChecklistItem } from './checklist-item.entity';
import { AnalysisFinding } from '../analysis/analysis-finding.entity';
import { User } from '../auth/user.entity';

@Entity('ci_checklist_responses')
export class ChecklistResponse {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'project_id' })
  projectId!: string;

  @ManyToOne(() => Project, (p) => p.checklistResponses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ name: 'checklist_item_id' })
  checklistItemId!: string;

  @ManyToOne(() => ChecklistItem)
  @JoinColumn({ name: 'checklist_item_id' })
  checklistItem!: ChecklistItem;

  @Column({ default: 'pending' })
  status!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @Column({ name: 'finding_id', nullable: true })
  findingId!: string | null;

  @ManyToOne(() => AnalysisFinding, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'finding_id' })
  finding!: AnalysisFinding | null;

  @Column({ name: 'reviewed_by', nullable: true })
  reviewedBy!: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewed_by' })
  reviewer!: User | null;

  @Column({ name: 'reviewed_at', type: 'timestamptz', nullable: true })
  reviewedAt!: Date | null;
}
