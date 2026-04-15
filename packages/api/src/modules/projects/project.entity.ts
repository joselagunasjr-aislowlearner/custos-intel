import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { PlanPhoto } from '../photos/plan-photo.entity';
import { AnalysisFinding } from '../analysis/analysis-finding.entity';
import { ChecklistResponse } from '../checklist/checklist-response.entity';

@Entity('ci_projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  name!: string;

  @Column({ nullable: true })
  address!: string | null;

  @Column({ name: 'building_type', nullable: true })
  buildingType!: string | null;

  @Column({ name: 'construction_type', nullable: true })
  constructionType!: string | null;

  @Column({ name: 'occupancy_group', nullable: true })
  occupancyGroup!: string | null;

  @Column({ nullable: true })
  stories!: number | null;

  @Column({ name: 'square_footage', nullable: true })
  squareFootage!: number | null;

  @Column({ name: 'sprinkler_system_type', nullable: true })
  sprinklerSystemType!: string | null;

  @Column({ name: 'hazard_classification', nullable: true })
  hazardClassification!: string | null;

  @Column({ default: 'in_progress' })
  status!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => PlanPhoto, (photo) => photo.project)
  photos!: PlanPhoto[];

  @OneToMany(() => AnalysisFinding, (finding) => finding.project)
  findings!: AnalysisFinding[];

  @OneToMany(() => ChecklistResponse, (response) => response.project)
  checklistResponses!: ChecklistResponse[];
}
