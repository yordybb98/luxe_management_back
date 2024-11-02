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
}
