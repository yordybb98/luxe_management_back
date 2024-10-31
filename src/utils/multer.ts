import { BadRequestException } from '@nestjs/common';
import { mkdir } from 'fs/promises';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: async (req, file, callback) => {
      try {
        const path = req.headers.path as string;
        console.log(req.headers);
        const dynamicPath =
          await getDynamicPath(
            path,
          ); /* '\\\\LUXE_BACKUP\\Luxe Files\\DEVELOP' */ // Obtén la ruta usando el ID
        callback(null, dynamicPath);
      } catch (error) {
        callback(
          new BadRequestException(
            'No se pudo determinar la ruta de destino del archivo.',
          ),
          null,
        );
      }
    },
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = extname(file.originalname) || '.jpg';
      const newFilename = `${file.fieldname}-${uniqueSuffix}${extension}`;
      callback(null, newFilename);
    },
  }),
  fileFilter: (req, file, callback) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = extname(file.originalname).toLowerCase();
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && allowedTypes.test(ext)) {
      callback(null, true);
    } else {
      callback(new BadRequestException('Only image files are allowed!'), false);
    }
  },
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5 MB
};

async function getDynamicPath(path: string): Promise<string> {
  console.log({ path });
  const baseDirectory = '\\\\LUXE_BACKUP\\Luxe Files\\DEVELOP';
  const folderPath = join(baseDirectory, path, `Preview`);

  try {
    await mkdir(folderPath, { recursive: true });
    return folderPath;
  } catch (error) {
    console.error('Error creating directory:', error);
    throw new Error(
      'We were unable to create the directory. Please try again later.',
    );
  }
}
