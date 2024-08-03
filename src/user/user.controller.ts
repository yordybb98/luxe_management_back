import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/createUserDto';
import * as bcrypt from 'bcrypt';
import { PublicUserData } from './dto/publicUserData';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<PublicUserData[]> {
    const users = await this.userService.getAllUsers();

    //removing sensitive data
    const publicUsersData = users.map(({ password, id, ...rest }) => rest);

    return publicUsersData;
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUserById(@Param('id') id: string): Promise<User> {
    const userFound = await this.userService.getUserById(Number(id));
    if (!userFound) throw new NotFoundException('User not found');
    return userFound;
  }

  @Post()
  async createUser(@Body() data: CreateUserDto): Promise<PublicUserData> {
    //checking if user already exists
    const userExists = await this.userService.getUserByEmail(data.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    //hashing password
    data.password = await bcrypt.hash(data.password, 10);

    //creating user
    //removing sensitive data from response
    const { password, id, ...rest } = await this.userService.createUser(data);

    return rest;
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() data: User): Promise<User> {
    try {
      return await this.userService.updateUser(Number(id), data);
    } catch (err) {
      throw new NotFoundException("User doesn't exist");
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<PublicUserData> {
    try {
      const userDeleted = await this.userService.deleteUser(Number(id));
      const { id: userId, password, ...rest } = userDeleted;
      return rest;
    } catch (err) {
      throw new NotFoundException("User doesn't exist");
    }
  }
}
