import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Project } from '../projects/project.entity';

@Entity('ci_plan_photos')
export class PlanPhoto {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'project_id' })
  projectId!: string;

  @ManyToOne(() => Project, (project) => project.photos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ name: 'storage_path' })
  storagePath!: string;

  @Column({ name: 'storage_url', nullable: true })
  storageUrl!: string | null;

  @Column({ name: 'original_filename', nullable: true })
  originalFilename!: string | null;

  @Column({ name: 'file_size_bytes', nullable: true })
  fileSizeBytes!: number | null;

  @Column({ name: 'mime_type', nullable: true })
  mimeType!: string | null;

  @Column({ name: 'photo_type', nullable: true })
  photoType!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt!: Date;
}
