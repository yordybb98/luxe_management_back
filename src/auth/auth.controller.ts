import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/signInDto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './guards/public.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() { username, password }: SignInDto) {
    return this.authService.signIn(username, password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signUp')
  signUp(
    @Body()
    { username, password, name, email, roleId, departmentId }: SignUpDto,
  ) {
    return this.authService.signUp(
      username,
      password,
      name,
      email,
      roleId,
      departmentId,
    );
  }
}
