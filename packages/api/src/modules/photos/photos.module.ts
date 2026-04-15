import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { PlanPhoto } from './plan-photo.entity';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { StorageService } from './storage.service';
import { User } from '../auth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlanPhoto, User]),
    MulterModule.register({ storage: undefined }), // memory storage
  ],
  controllers: [PhotosController],
  providers: [PhotosService, StorageService],
  exports: [PhotosService, StorageService],
})
export class PhotosModule {}
