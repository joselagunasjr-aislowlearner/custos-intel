import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../../common/decorators/current-user.decorator';
import { ChecklistService } from './checklist.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class ChecklistController {
  constructor(private readonly service: ChecklistService) {}

  @Get('checklist/items')
  getAllItems() {
    return this.service.getAllItems();
  }

  @Get('projects/:projectId/checklist')
  getProjectChecklist(@Param('projectId') projectId: string) {
    return this.service.getProjectChecklist(projectId);
  }

  @Put('projects/:projectId/checklist/:itemId')
  updateResponse(
    @Param('projectId') projectId: string,
    @Param('itemId') itemId: string,
    @Body() body: { status: string; notes?: string },
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.updateResponse(
      projectId,
      itemId,
      body.status,
      body.notes || null,
      user.userId,
    );
  }

  @Post('projects/:projectId/checklist/bulk')
  bulkUpdate(
    @Param('projectId') projectId: string,
    @Body()
    body: {
      updates: Array<{
        checklistItemId: string;
        status: string;
        notes?: string;
      }>;
    },
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.bulkUpdate(projectId, body.updates, user.userId);
  }
}
