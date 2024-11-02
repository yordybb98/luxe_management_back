// src/image/image.service.ts

import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { join } from 'path';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { writeFile } from 'fs/promises';

@Injectable()
export class ImageService {
  async resizeAndSaveImage(file: any, path: string): Promise<string> {
    // Create the output directory if it doesn't exist
    const reducedDir = join(path, 'Preview');
    if (!existsSync(reducedDir)) {
      mkdirSync(reducedDir, { recursive: true });
    }

    // Create the original directory if it doesn't exist
    const orginialDir = join(path, 'Arte Final');
    if (!existsSync(orginialDir)) {
      mkdirSync(orginialDir, { recursive: true });
    }

    // Create the original file path
    const originalFilePath = join(
      orginialDir,
      `ArteFinal-${file.originalname}`,
    );

    // Save the original image
    await writeFile(originalFilePath, file.buffer);

    // Create the output file path
    const outputFilePath = join(reducedDir, `Preview-${file.originalname}`);

    // Calculate the reduction factor
    const reductionFactor = 0.4;
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
        width: Math.round(metadata.width * reductionFactor * 0.2),
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

  /* async getImageStream(path: string) {
    const directoryPath = join(__dirname, '..', 'uploads', path);
    try {
      // Lee el contenido del directorio
      const files = await readdir(directoryPath);

      // Filtra solo los archivos de imagen
      const images = files.filter(
        (file) => /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(file), // Añade más extensiones si es necesario
      );

      console.log({ images });
      return images;
      // Devuelve la lista de imágenes
    } catch (err) {}
  } */
}
