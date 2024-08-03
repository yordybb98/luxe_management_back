import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { createUserDto } from './dto/createUserDto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const userFound = await this.userService.getUserById(Number(id));
    if (!userFound) throw new NotFoundException('User not found');
    return userFound;
  }

  @Post()
  async createUser(@Body() data: createUserDto): Promise<User> {
    return this.userService.createUser(data);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() data: User): Promise<User> {
    try {
      return await this.userService.updateUser(Number(id), data);
    } catch (err) {
      throw new NotFoundException("User doesn't exist");
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    try {
      return await this.userService.deleteUser(Number(id));
    } catch (err) {
      throw new NotFoundException("User doesn't exist");
    }
  }
}
