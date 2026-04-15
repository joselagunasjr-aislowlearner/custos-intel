import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';
import { v4 as uuidv4 } from 'uuid';

const BUCKET = 'plan-photos';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async upload(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<{ path: string; url: string }> {
    const ext = file.originalname.split('.').pop() || 'jpg';
    const path = `${projectId}/${uuidv4()}.${ext}`;

    const { error } = await this.supabase
      .getClient()
      .storage.from(BUCKET)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      this.logger.error(`Upload failed: ${error.message}`);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    const { data: urlData } = await this.supabase
      .getClient()
      .storage.from(BUCKET)
      .createSignedUrl(path, 60 * 60 * 24 * 7); // 7-day signed URL

    return { path, url: urlData?.signedUrl || '' };
  }

  async getSignedUrl(path: string): Promise<string> {
    const { data } = await this.supabase
      .getClient()
      .storage.from(BUCKET)
      .createSignedUrl(path, 60 * 60); // 1-hour signed URL

    return data?.signedUrl || '';
  }

  async download(path: string): Promise<Buffer> {
    const { data, error } = await this.supabase
      .getClient()
      .storage.from(BUCKET)
      .download(path);

    if (error || !data) {
      throw new Error(`Failed to download file: ${error?.message}`);
    }

    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async delete(path: string): Promise<void> {
    const { error } = await this.supabase
      .getClient()
      .storage.from(BUCKET)
      .remove([path]);

    if (error) {
      this.logger.error(`Delete failed: ${error.message}`);
    }
  }
}
