import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('ci_code_references')
export class CodeReference {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  category!: string;

  @Column({ name: 'code_source' })
  codeSource!: string;

  @Column({ nullable: true })
  section!: string | null;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({
    name: 'numeric_value',
    type: 'decimal',
    nullable: true,
  })
  numericValue!: number | null;

  @Column({ nullable: true })
  unit!: string | null;

  @Column({ type: 'text', array: true, default: '{}' })
  tags!: string[];

  @Column({ name: 'sort_order', default: 0 })
  sortOrder!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
