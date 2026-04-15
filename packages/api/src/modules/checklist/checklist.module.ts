import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistItem } from './checklist-item.entity';
import { ChecklistResponse } from './checklist-response.entity';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { User } from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChecklistItem, ChecklistResponse, User])],
  controllers: [ChecklistController],
  providers: [ChecklistService],
  exports: [ChecklistService],
})
export class ChecklistModule {}
