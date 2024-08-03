import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignInResponseDto } from './dto/signInDto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<SignInResponseDto> {
    //checking if user exists
    const user = await this.usersService.getUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    //checking if password is correct
    if (user?.password !== pass) {
      throw new UnauthorizedException('Wrong credentials');
    }

    //removing password from response
    const { password, ...result } = user;

    //contructing token data
    const payload = { sub: user.id, username: user.username };

    //signing token
    return { ...result, token: await this.jwtService.signAsync(payload) };
  }
}
