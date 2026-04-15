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

  @Column({ type: 'varchar', nullable: true })
  address!: string | null;

  @Column({ name: 'building_type', type: 'varchar', nullable: true })
  buildingType!: string | null;

  @Column({ name: 'construction_type', type: 'varchar', nullable: true })
  constructionType!: string | null;

  @Column({ name: 'occupancy_group', type: 'varchar', nullable: true })
  occupancyGroup!: string | null;

  @Column({ type: 'int', nullable: true })
  stories!: number | null;

  @Column({ name: 'square_footage', type: 'int', nullable: true })
  squareFootage!: number | null;

  @Column({ name: 'sprinkler_system_type', type: 'varchar', nullable: true })
  sprinklerSystemType!: string | null;

  @Column({ name: 'hazard_classification', type: 'varchar', nullable: true })
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
