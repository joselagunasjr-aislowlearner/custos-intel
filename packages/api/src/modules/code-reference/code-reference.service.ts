import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CodeReference } from './code-reference.entity';

@Injectable()
export class CodeReferenceService {
  constructor(
    @InjectRepository(CodeReference)
    private readonly repo: Repository<CodeReference>,
  ) {}

  async findAll(page = 1, limit = 50): Promise<{ data: CodeReference[]; total: number }> {
    const [data, total] = await this.repo.findAndCount({
      order: { category: 'ASC', sortOrder: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findByCategory(
    category: string,
  ): Promise<Array<{ section: string; title: string; content: string; codeSource: string }>> {
    const refs = await this.repo.find({
      where: { category },
      order: { sortOrder: 'ASC' },
    });
    return refs.map((r) => ({
      section: r.section || '',
      title: r.title,
      content: r.content,
      codeSource: r.codeSource,
    }));
  }

  async search(query: string): Promise<CodeReference[]> {
    return this.repo
      .createQueryBuilder('cr')
      .where(
        `to_tsvector('english', cr.title || ' ' || cr.content) @@ plainto_tsquery('english', :query)`,
        { query },
      )
      .orderBy('cr.sort_order', 'ASC')
      .limit(50)
      .getMany();
  }
}
