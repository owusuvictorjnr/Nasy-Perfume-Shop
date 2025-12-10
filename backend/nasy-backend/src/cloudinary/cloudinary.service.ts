import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { Readable } from 'stream';

// Type definitions for Cloudinary delete operations
export interface CloudinaryDeleteResponse {
  result: 'ok' | 'not found';
}

export interface CloudinaryDeleteMultipleResponse {
  deleted: Record<string, string>;
  deleted_counts: {
    [key: string]: {
      original: number;
      derived: number;
    };
  };
  partial: boolean;
  rate_limit_allowed: number;
  rate_limit_reset_at: Date;
  rate_limit_remaining: number;
}

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'products',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `nasy-shop/${folder}`,
          resource_type: 'image',
          transformation: [
            { width: 1000, height: 1000, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) return reject(new Error(error.message || 'Upload failed'));
          if (result) return resolve(result);
          reject(new Error('Upload failed'));
        },
      );

      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
    folder: string = 'products',
  ): Promise<UploadApiResponse[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }

  async deleteImage(publicId: string): Promise<CloudinaryDeleteResponse> {
    return cloudinary.uploader.destroy(
      publicId,
    ) as Promise<CloudinaryDeleteResponse>;
  }

  async deleteMultipleImages(
    publicIds: string[],
  ): Promise<CloudinaryDeleteMultipleResponse> {
    return cloudinary.api.delete_resources(
      publicIds,
    ) as Promise<CloudinaryDeleteMultipleResponse>;
  }

  getOptimizedUrl(publicId: string, width?: number, height?: number): string {
    return cloudinary.url(publicId, {
      transformation: [
        { width: width || 800, height: height || 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });
  }
}
