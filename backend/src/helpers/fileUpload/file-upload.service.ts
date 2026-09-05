import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class FileUploadService {
  constructor() {
    console.log('CLOUDINARY ENV CHECK:');
    console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('CLOUDINARY_API_KEY exists:', !!process.env.CLOUDINARY_API_KEY);
    console.log(
      'CLOUDINARY_API_SECRET exists:',
      !!process.env.CLOUDINARY_API_SECRET,
    );

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(file: any): Promise<string> {
    console.log('Uploading file to Cloudinary...');

    try {
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            if (!result) {
              reject(new Error('Cloudinary upload failed'));
              return;
            }

            resolve(result);
          },
        );

        uploadStream.end(file.buffer);
      });

      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload failed:', error);

      throw new InternalServerErrorException('Failed to upload file');
    }
  }
}
