import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignInResponseDto, SignUpResponseDto } from './dto/signInDto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<SignInResponseDto> {
    //checking if user exists
    const user = await this.usersService.getUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    //checking if password is correct
    const isPasswordValid = await bcrypt.compareSync(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong credentials');
    }

    //removing password from response
    const { password, id, ...result } = user;

    //contructing token data
    const payload = { sub: user.id, email: user.email, role: user.role };

    //signing token
    return { ...result, token: await this.jwtService.signAsync(payload) };
  }

  async signUp(
    username: string,
    password: string,
    name: string,
    email: string,
    roleId: number,
    departmentId: number,
  ): Promise<SignUpResponseDto> {
    const role = await this.roleService.getRoleById(roleId);
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    /* const department =
      await this.departmentService.getDepartmentById(departmentId);
    if (!department) {
      throw new BadRequestException('Department not found');
    } */

    await this.usersService.createUser({
      username,
      password: await bcrypt.hash(password, 10),
      name,
      email,
      roleId,
      departmentId,
      orders: [],
    });
    return {
      username,
      name,
      email,
      roleId,
      departmentId,
      orders: [],
      projects: [],
      permissions: [],
    };
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const validated = await this.jwtService.verifyAsync(token);
      return !!validated;
    } catch (err) {
      return false;
      // throw new UnauthorizedException('Invalid token');
    }
  }
}
