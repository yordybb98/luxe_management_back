// src/image/image.service.ts

import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as pathLib from 'path';
import * as fs from 'fs';
import { writeFile } from 'fs/promises';
import { SUPPORTED_IMAGE_EXTENSIONS } from 'settings.config';

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
    const watermarkMetadata = await sharp(watermarkBuffer).metadata();

    // Resize the watermark
    let watermark = await sharp(Buffer.from(watermarkBuffer))
      .resize({
        width: Math.round(metadata.width * reductionFactor * 0.2),
      })
      .toBuffer();

    // Ensure the watermark size is smaller than the resized image
    const resizedImageMetadata = await sharp(resizedImageBuffer).metadata();
    if (
      watermarkMetadata.width > resizedImageMetadata.width ||
      watermarkMetadata.height > resizedImageMetadata.height
    ) {
      // Scale down the watermark if necessary
      watermark = await sharp(Buffer.from(watermarkBuffer))
        .resize({
          width: Math.round(resizedImageMetadata.width * reductionFactor * 0.2),
          height: Math.round(
            resizedImageMetadata.height * reductionFactor * 0.2,
          ),
        })
        .toBuffer();
    }

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

  async getAllImages(folderPath: string) {
    try {
      const decodedPath = decodeURIComponent(folderPath);

      const previewPath = pathLib.join(decodedPath, 'Preview');
      const finalArtPath = pathLib.join(decodedPath, 'Arte Final');

      const getImagesFrom = (directory: string): string[] => {
        if (!fs.existsSync(directory)) return [];

        const files = fs.readdirSync(directory);

        const regex = new RegExp(
          `\\.(${SUPPORTED_IMAGE_EXTENSIONS.join('|')})$`,
          'i',
        );

        return files
          .filter((file) => regex.test(file))
          .map((file) => pathLib.join(directory, file));
      };

      // 1. Try to get Preview images
      let imagePaths = getImagesFrom(previewPath);

      // 2. If there are no Preview images, try to get Arte Final images
      if (imagePaths.length === 0) {
        imagePaths = getImagesFrom(finalArtPath);
      }

      if (imagePaths.length === 0) {
        throw new Error('No images found in Preview or Arte Final');
      }

      // 3. Return the image paths
      return imagePaths.map((filePath) => {
        const encodedPath = encodeURIComponent(filePath);
        const alt = pathLib.basename(filePath);
        return {
          alt,
          src: encodedPath,
        };
      });
    } catch (error) {
      console.error('Error reading images:', error);
      throw new Error('Error reading images');
    }
  }

  getImagePath(filePath: string, highQuality: boolean): string {
    const decodedPath = decodeURIComponent(filePath);

    if (highQuality) {
      // Replace 'Preview' folder with 'Arte Final' and adjust file name
      const previewFolder = 'Preview';
      const arteFinalFolder = 'Arte Final';

      if (decodedPath.includes(previewFolder)) {
        const parentFolder = pathLib.dirname(decodedPath); // Get parent directory
        const newFolderPath = parentFolder.replace(
          previewFolder,
          arteFinalFolder,
        ); // Switch folder

        // Modify filename (remove 'Preview-' prefix)
        const fileName = pathLib.basename(decodedPath).replace(/^Preview-/, ''); // Removes 'Preview-' prefix

        const arteFinalPath = pathLib.join(newFolderPath, fileName); // Construct new path

        if (fs.existsSync(arteFinalPath)) {
          return arteFinalPath; // Return the high-quality version if it exists
        }
      }
    }

    return fs.existsSync(decodedPath) ? decodedPath : null; // Fallback to original file if exists
  }
}
