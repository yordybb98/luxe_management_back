import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, ValidateTokenDto } from './dto/signInDto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/guards/public.guard';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() { username, password }: SignInDto,
  ) {
    const response = await this.authService.signIn(username, password);

    /* const { token } = response; */

    /* // Setting the cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
      sameSite: 'strict',
    }); */
    return response;
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('authToken');
    return { success: true };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signUp')
  signUp(
    @Body()
    {
      username,
      password,
      name,
      email,
      roleId,
      phone,
      lastName,
      address,
    }: SignUpDto,
  ) {
    return this.authService.signUp(
      username,
      password,
      name,
      email,
      roleId,
      phone,
      lastName,
      address,
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('validateToken')
  async validateToken(@Body() { token }: ValidateTokenDto) {
    return this.authService.validateToken(token);
  }
}
