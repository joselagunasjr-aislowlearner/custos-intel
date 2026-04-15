import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChecklistItem } from './checklist-item.entity';
import { ChecklistResponse } from './checklist-response.entity';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(ChecklistItem)
    private readonly itemRepo: Repository<ChecklistItem>,
    @InjectRepository(ChecklistResponse)
    private readonly responseRepo: Repository<ChecklistResponse>,
  ) {}

  async getAllItems(): Promise<ChecklistItem[]> {
    return this.itemRepo.find({ order: { sortOrder: 'ASC' } });
  }

  async getProjectChecklist(
    projectId: string,
  ): Promise<
    Array<ChecklistItem & { response: ChecklistResponse | null }>
  > {
    const items = await this.itemRepo.find({ order: { sortOrder: 'ASC' } });
    const responses = await this.responseRepo.find({
      where: { projectId },
    });

    const responseMap = new Map(
      responses.map((r) => [r.checklistItemId, r]),
    );

    return items.map((item) => ({
      ...item,
      response: responseMap.get(item.id) || null,
    }));
  }

  async updateResponse(
    projectId: string,
    checklistItemId: string,
    status: string,
    notes: string | null,
    userId: string,
  ): Promise<ChecklistResponse> {
    let response = await this.responseRepo.findOne({
      where: { projectId, checklistItemId },
    });

    if (response) {
      response.status = status;
      response.notes = notes;
      response.reviewedBy = userId;
      response.reviewedAt = new Date();
    } else {
      response = this.responseRepo.create({
        projectId,
        checklistItemId,
        status,
        notes,
        reviewedBy: userId,
        reviewedAt: new Date(),
      });
    }

    return this.responseRepo.save(response);
  }

  async bulkUpdate(
    projectId: string,
    updates: Array<{
      checklistItemId: string;
      status: string;
      notes?: string;
    }>,
    userId: string,
  ): Promise<ChecklistResponse[]> {
    const results: ChecklistResponse[] = [];
    for (const update of updates) {
      const result = await this.updateResponse(
        projectId,
        update.checklistItemId,
        update.status,
        update.notes || null,
        userId,
      );
      results.push(result);
    }
    return results;
  }
}
