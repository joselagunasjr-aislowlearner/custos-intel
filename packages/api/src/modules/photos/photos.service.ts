import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanPhoto } from './plan-photo.entity';
import { StorageService } from './storage.service';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(PlanPhoto) private readonly repo: Repository<PlanPhoto>,
    private readonly storage: StorageService,
  ) {}

  async findByProject(projectId: string): Promise<PlanPhoto[]> {
    const photos = await this.repo.find({
      where: { projectId },
      order: { uploadedAt: 'DESC' },
    });

    // Refresh signed URLs
    for (const photo of photos) {
      photo.storageUrl = await this.storage.getSignedUrl(photo.storagePath);
    }

    return photos;
  }

  async findOne(id: string): Promise<PlanPhoto> {
    const photo = await this.repo.findOne({ where: { id } });
    if (!photo) throw new NotFoundException('Photo not found');
    photo.storageUrl = await this.storage.getSignedUrl(photo.storagePath);
    return photo;
  }

  async upload(
    projectId: string,
    file: Express.Multer.File,
    photoType?: string,
    description?: string,
  ): Promise<PlanPhoto> {
    const { path, url } = await this.storage.upload(projectId, file);

    const photo = this.repo.create({
      projectId,
      storagePath: path,
      storageUrl: url,
      originalFilename: file.originalname,
      fileSizeBytes: file.size,
      mimeType: file.mimetype,
      photoType: photoType || null,
      description: description || null,
    });

    return this.repo.save(photo);
  }

  async delete(id: string): Promise<void> {
    const photo = await this.findOne(id);
    await this.storage.delete(photo.storagePath);
    await this.repo.remove(photo);
  }
}
