import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PhotosService } from './photos.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class PhotosController {
  constructor(private readonly service: PhotosService) {}

  @Get('projects/:projectId/photos')
  findByProject(@Param('projectId') projectId: string) {
    return this.service.findByProject(projectId);
  }

  @Post('projects/:projectId/photos')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  upload(
    @Param('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('photoType') photoType?: string,
    @Body('description') description?: string,
  ) {
    return this.service.upload(projectId, file, photoType, description);
  }

  @Delete('photos/:id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
