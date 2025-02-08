import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeService {
  odooUTC = async (dateString: string) => {
    const localDate = new Date(dateString);

    const utcYear = localDate.getUTCFullYear();
    const utcMonth = String(localDate.getUTCMonth() + 1).padStart(2, '0');
    const utcDay = String(localDate.getUTCDate()).padStart(2, '0');
    const utcHours = String(localDate.getUTCHours()).padStart(2, '0');
    const utcMinutes = String(localDate.getUTCMinutes()).padStart(2, '0');

    const utcDateString = `${utcYear}-${utcMonth}-${utcDay} ${utcHours}:${utcMinutes}`;

    return utcDateString;
  };
}
