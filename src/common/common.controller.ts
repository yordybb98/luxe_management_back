import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  authenticateFromOdoo,
  getOdooStages,
  getOdooTeams,
} from 'src/order/odooImport/api';
import { Stage } from './types/stage';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/multer';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import sharp from 'sharp';

@Controller('')
export class CommonController {
  constructor() {}

  @Get('stages')
  async getStages(@Request() req, @Query('team_id') team_id) {
    const uid = await authenticateFromOdoo();
    const stages = (await getOdooStages(uid, +team_id)) as Stage[];

    return stages;
  }

  @Get('teams')
  async getTeams(@Request() req) {
    const uid = await authenticateFromOdoo();
    const teams = await getOdooTeams(uid);
    return teams;
  }

  @Post('image')
  async uploadFile(@Req() req: Request, @Body() data) {
    console.log({ data });
    // Asegúrate de configurar el tamaño máximo en el lado del cliente y el límite de carga del servidor para evitar problemas de tamaño.
    if (!data.file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo.');
    }

    const buffer = data.file.buffer; // Buffer del archivo recibido directamente desde la solicitud.
    const dynamicPath = path.join('\\LUXE_BACKUP\\Luxe Files', `Folder`);
    const uniqueFilename = `file-${Date.now()}.jpg`;
    const outputPath = path.join(dynamicPath, uniqueFilename);

    try {
      // Verifica que el directorio exista o créalo
      if (!existsSync(dynamicPath)) {
        mkdirSync(dynamicPath, { recursive: true });
      }

      // Procesa y guarda la imagen comprimida
      await sharp(buffer)
        .resize({ width: 800, height: 800, fit: sharp.fit.inside })
        .toFormat('jpeg', { quality: 80 })
        .toFile(outputPath);

      console.log('Archivo comprimido y guardado:', outputPath);
      return { url: uniqueFilename };
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      throw new BadRequestException('No se pudo procesar la imagen.');
    }
  }
}
