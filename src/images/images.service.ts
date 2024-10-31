// src/image/image.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import * as sharp from 'sharp';
import { join } from 'path';
import { createReadStream, existsSync, mkdirSync, readFileSync } from 'fs';
import { writeFile } from 'fs/promises';

@Injectable()
export class ImageService {
  async resizeAndSaveImage(file: any, path: string): Promise<string> {
    // Create the output directory if it doesn't exist
    const outputDir = join(__dirname, '..', 'uploads', path);
    console.log({ outputDir });
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Create the output file path
    const outputFilePath = join(outputDir, `Preview-${file.originalname}`);

    // Calculate the reduction factor
    const reductionFactor = 0.1;
    const metadata = await sharp(file.buffer).metadata();

    //Resize the image
    const resizedImageBuffer = await sharp(file.buffer)
      .resize({
        width: Math.round(metadata.width * reductionFactor),
        height: Math.round(metadata.height * reductionFactor),
      })
      .toBuffer();

    const watermarkSvg = readFileSync('src/assets/watermark.svg', 'utf8');

    // Resize the watermark
    const watermark = await sharp(Buffer.from(watermarkSvg))
      .resize({
        width: Math.round(metadata.width * reductionFactor * 0.1),
      })
      .toBuffer();

    // Add the watermark
    const finalImageBuffer = await sharp(resizedImageBuffer)
      .composite([
        {
          input: watermark,
          gravity: 'center', // Watermark position
          blend: 'overlay', // Overlay function
          tile: true, // Repeat the watermark
        },
      ])
      .toBuffer();

    // Save the final image
    await writeFile(outputFilePath, finalImageBuffer);

    // Return the output file path
    return outputFilePath;
  }

  getImageStream(id: string, filename: string) {
    const filePath = join(__dirname, '..', 'uploads', id, filename);
    if (!existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }
    return createReadStream(filePath);
  }
}
