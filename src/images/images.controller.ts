// src/image/image.controller.ts

import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  UploadedFiles,
  Get,
  Param,
  Res,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageService } from './images.service';
import { ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import { Response } from 'express';
import { Public } from 'src/common/guards/public.guard';

@Controller('images')
@ApiTags('Images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadAndResizeImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() data,
  ) {
    const filePaths = await Promise.all(
      files.map((file) =>
        this.imageService.resizeAndSaveImage(file, data.path),
      ),
    );
    return { filePaths }; //  Return the path for confirmation
  }

  @Public()
  //Serve a Single Encoded Image
  @Get(':filePath')
  getImage(
    @Param('filePath') filePath: string,
    @Query('highQuality') highQuality: string, // Read highQuality as a query param
    @Res() res: Response,
  ) {
    const isHighQuality = highQuality === 'true'; // Convert string to boolean
    const imagePath = this.imageService.getImagePath(filePath, isHighQuality);

    if (imagePath) {
      res.sendFile(imagePath);
    } else {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
  }

  @Public()
  //Get All Preview Images from a Specific Path
  @Get('all/:filePath')
  async getAllImages(
    @Param('filePath') filePath: string,
    @Res() res: Response,
  ) {
    try {
      const images = await this.imageService.getAllImages(filePath);
      res.json({ images });
    } catch (error) {
      console.error('Error reading images:', error);
      res.status(500).json({ message: 'Error reading images', error });
    }
  }

  //   @Post('preview')
  //   async getImage(@Body() data, @Res() res: Response) {
  //     console.log(data);
  //     console.log('GETTING IMAGE API');
  //     const outputDir = join(
  //       settings.BASE_ROOT_DIRECTORY,
  //       '..',
  //       'uploads',
  //       data.path,
  //     );
  //     const imageStream = await this.imageService.getImageStream(data.path);

  //     const url = join(outputDir, imageStream[0]);

  //     console.log({ url });
  //     console.log({ outputDir });
  //     console.log({ imageStream });

  //     return res.sendFile(url);
  //     /* res.set('Content-Type', 'image/jpeg');
  //     imageStream.pipe(res); */
  //   }
}
