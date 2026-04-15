import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CodeReferenceService } from './code-reference.service';

@Controller('codes')
@UseGuards(JwtAuthGuard)
export class CodeReferenceController {
  constructor(private readonly service: CodeReferenceService) {}

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.service.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.service.search(query || '');
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.service.findByCategory(category);
  }
}
