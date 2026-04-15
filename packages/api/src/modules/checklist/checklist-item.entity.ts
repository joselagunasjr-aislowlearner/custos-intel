import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ci_checklist_items')
export class ChecklistItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  category!: string;

  @Column({ name: 'item_number' })
  itemNumber!: number;

  @Column({ type: 'text' })
  description!: string;

  @Column({ name: 'code_reference', type: 'varchar', nullable: true })
  codeReference!: string | null;

  @Column({ name: 'sort_order' })
  sortOrder!: number;
}
