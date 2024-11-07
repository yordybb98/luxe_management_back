// src/image/image.service.ts

import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as pathLib from 'path';
import * as fs from 'fs';
import { writeFile } from 'fs/promises';

@Injectable()
export class ImageService {
  async resizeAndSaveImage(file: any, path: string): Promise<string> {
    // Create the output directory if it doesn't exist
    const reducedDir = pathLib.join(path, 'Preview');
    if (!fs.existsSync(reducedDir)) {
      fs.mkdirSync(reducedDir, { recursive: true });
    }

    // Create the original directory if it doesn't exist
    /* const orginialDir = pathLib.join(path, 'Arte Final');
    if (!fs.existsSync(orginialDir)) {
      fs.mkdirSync(orginialDir, { recursive: true });
    } */

    // Create the original file path
    /* const originalFilePath = pathLib.join(
      orginialDir,
      `ArteFinal-${file.originalname}`,
    ); */

    /* // Save the original image
    await writeFile(originalFilePath, file.buffer); */

    // Create the output file path

    const outputFilePath = pathLib.join(
      reducedDir,
      `Preview-${file.originalname}`,
    );

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

    const watermarkBuffer = fs.readFileSync('src/assets/watermark.png');

    // Resize the watermark
    const watermark = await sharp(Buffer.from(watermarkBuffer))
      .resize({
        width: Math.round(metadata.width * reductionFactor * 0.2),
      })
      .toBuffer();

    // Add the watermark
    const finalImageBuffer = await sharp(resizedImageBuffer)
      .composite([
        {
          input: watermark,
          gravity: 'northwest', // Watermark position
          blend: 'overlay', // Overlay function
        },
        {
          input: watermark,
          gravity: 'north', // Watermark position
          blend: 'overlay', // Overlay function
        },
        {
          input: watermark,
          gravity: 'northeast', // Watermark position
          blend: 'overlay', // Overlay function
        },
        {
          input: watermark,
          gravity: 'east', // Watermark position
          blend: 'overlay', // Overlay function
        },
        {
          input: watermark,
          gravity: 'center', // Watermark position
          blend: 'overlay', // Overlay function
        },
        {
          input: watermark,
          gravity: 'west', // Watermark position
          blend: 'overlay', // Overlay function
        },
        {
          input: watermark,
          gravity: 'southwest', // Watermark position
          blend: 'overlay', // Overlay function
        },
        {
          input: watermark,
          gravity: 'south', // Watermark position
          blend: 'overlay', // Overlay function
        },
        {
          input: watermark,
          gravity: 'southeast', // Watermark position
          blend: 'overlay', // Overlay function
        },
      ])
      .toBuffer();

    // Save the final image
    await writeFile(outputFilePath, finalImageBuffer);

    // Return the output file path
    return outputFilePath;
  }

  async getImagesFromFolder(folderPath) {
    try {
      // Read all files in the folder
      const files = fs.readdirSync(folderPath);

      // Filter files by image extensions
      const imageExtensions = [
        '.jpg',
        '.jpeg',
        '.png',
        '.webp',
        '.bmp',
        '.tiff',
        '.jfif',
      ];
      const imageFiles = files.filter((file) => {
        const ext = pathLib.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      });

      // Map image files to only originalName and buffer
      const images = await Promise.all(
        imageFiles.map(async (file) => {
          const filePath = pathLib.join(folderPath, file);
          const buffer = fs.readFileSync(filePath);

          return {
            originalname: file,
            buffer: buffer,
          };
        }),
      );

      return images;
    } catch (error) {
      console.error('Error reading images:', error);
      throw error;
    }
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
