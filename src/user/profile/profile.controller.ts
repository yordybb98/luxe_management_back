import { Controller, Get, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from '../user.service';

@ApiBearerAuth()
@ApiTags('Preferences')
@Controller('preferences')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('profile/generalInfo')
  async getGeneralInfo(
    @Request() req,
  ): Promise<{ id: number; name: string; lastName: string; email: string }> {
    const userLoggedIn = await this.authService.getUserLoggedIn(req);

    const user = await this.userService.getUserById(userLoggedIn.sub);

    return {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
    };
  }

  @Get('profile/displayInfo')
  async getDisplayInfo(@Request() req): Promise<{ rowsPerPage: number }> {
    const userLoggedIn = await this.authService.getUserLoggedIn(req);
    return { rowsPerPage: 0 };
  }
}
