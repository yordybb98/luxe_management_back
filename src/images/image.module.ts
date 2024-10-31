import { Module } from '@nestjs/common';
import { ImageController } from './images.controller';
import { ImageService } from './images.service';

@Module({
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
