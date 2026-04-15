import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../../common/decorators/current-user.decorator';
import { AnalysisService } from './analysis.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class AnalysisController {
  constructor(private readonly service: AnalysisService) {}

  @Get('projects/:projectId/findings')
  findByProject(@Param('projectId') projectId: string) {
    return this.service.findByProject(projectId);
  }

  @Post('projects/:projectId/analyze')
  analyzeProject(
    @Param('projectId') projectId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.analyzeProject(projectId, user.userId);
  }

  @Post('photos/:photoId/analyze')
  analyzePhoto(
    @Param('photoId') photoId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.analyzePhoto(photoId, user.userId);
  }
}
