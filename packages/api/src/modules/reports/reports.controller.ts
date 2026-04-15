import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../../common/decorators/current-user.decorator';
import { ReportsService } from './reports.service';

@Controller('projects/:projectId/report')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('json')
  getReportData(
    @Param('projectId') projectId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.getReportData(projectId, user.userId);
  }

  @Get('pdf')
  async downloadPdf(
    @Param('projectId') projectId: string,
    @CurrentUser() user: CurrentUserPayload,
    @Res() res: Response,
  ) {
    const pdf = await this.service.generatePdf(projectId, user.userId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="custos-intel-report-${projectId}.pdf"`,
      'Content-Length': pdf.length,
    });
    res.end(pdf);
  }
}
