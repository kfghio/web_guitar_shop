import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Render,
  BadRequestException, Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly storage: StorageService) {}

  @Get()
  @Render('upload')
  showUploadPage() {
    return {
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }

  @Get(':key')
  getFile(@Param('key') key: string) {
    return {
      url: this.storage.getFileUrl(key),
    };
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('Only image files are allowed!'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const url = await this.storage.uploadFile(file);
      return {
        success: true,
        url,
        message: 'File uploaded successfully',
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }
}
