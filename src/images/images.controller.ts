// src/image/image.controller.ts

import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  Body,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './images.service';
import { Response } from 'express';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndResizeImage(@UploadedFile() file: any, @Body() data) {
    const filePath = await this.imageService.resizeAndSaveImage(
      file,
      data.path,
    );

    console.log({ filePath });
    return { filePath }; //  Return the path for confirmation
  }

  @Get(':id/:filename')
  async getImage(
    @Param('id') id: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const imageStream = this.imageService.getImageStream(id, filename);
    res.set('Content-Type', 'image/jpeg');
    imageStream.pipe(res);
  }
}
