// src/image/image.controller.ts

import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageService } from './images.service';
import { ApiTags } from '@nestjs/swagger';

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
