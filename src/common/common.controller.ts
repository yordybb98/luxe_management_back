import { Controller, Get, Request } from '@nestjs/common';
import { authenticateFromOdoo, getOdooStages } from 'src/order/odooImport/api';
import { Stage } from './types/stage';

@Controller('')
export class CommonController {
  constructor() {}

  @Get('stages')
  async getStages(@Request() req) {
    const uid = await authenticateFromOdoo();
    const stages = await getOdooStages(uid);

    const uniqueStages = [];

    const seenNames = new Set();
    for (const stage of stages as Stage[]) {
      if (!seenNames.has(stage.name)) {
        seenNames.add(stage.name);
        uniqueStages.push(stage);
      }
    }

    return uniqueStages;
  }
}
