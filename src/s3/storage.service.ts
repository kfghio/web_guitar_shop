import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor() {
    const accessKeyId = process.env.YC_ACCESS_KEY;
    const secretAccessKey = process.env.YC_SECRET_KEY;
    const bucket = process.env.YC_BUCKET_NAME;

    if (!accessKeyId || !secretAccessKey || !bucket)
      throw new Error('Креды не найдены для Yandex S3');

    this.bucket = bucket;

    this.s3 = new S3Client({
      region: 'ru-central1',
      endpoint: 'https://storage.yandexcloud.net',
      forcePathStyle: true,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const Key = `${uuid()}-${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.YC_BUCKET_NAME,
        Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `https://storage.yandexcloud.net/${process.env.YC_BUCKET_NAME}/${Key}`;
  }

  async getFileUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: process.env.YC_BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(this.s3, command, { expiresIn: 3600 }); // Ссылка на 1 час
  }
}
