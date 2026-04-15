import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ChecklistItem } from '../modules/checklist/checklist-item.entity';
import { CodeReference } from '../modules/code-reference/code-reference.entity';
import { checklistItemsSeed } from './checklist-items.seed';
import { codeReferencesSeed } from './code-references.seed';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [ChecklistItem, CodeReference],
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  await dataSource.initialize();
  console.log('Connected to database');

  // Seed checklist items
  const checklistRepo = dataSource.getRepository(ChecklistItem);
  const existingChecklist = await checklistRepo.count();
  if (existingChecklist === 0) {
    for (const item of checklistItemsSeed) {
      await checklistRepo.save(checklistRepo.create(item));
    }
    console.log(`Seeded ${checklistItemsSeed.length} checklist items`);
  } else {
    console.log(`Skipping checklist seed — ${existingChecklist} items already exist`);
  }

  // Seed code references
  const codeRefRepo = dataSource.getRepository(CodeReference);
  const existingRefs = await codeRefRepo.count();
  if (existingRefs === 0) {
    for (const ref of codeReferencesSeed) {
      await codeRefRepo.save(codeRefRepo.create(ref));
    }
    console.log(`Seeded ${codeReferencesSeed.length} code references`);
  } else {
    console.log(`Skipping code reference seed — ${existingRefs} refs already exist`);
  }

  await dataSource.destroy();
  console.log('Seed complete');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
