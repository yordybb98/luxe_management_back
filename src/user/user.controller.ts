import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  NotImplementedException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Permission, User } from '@prisma/client';
import { CreateUserDto } from './dto/createUserDto';
import * as bcrypt from 'bcrypt';
import { PublicUserData } from './dto/publicUserData';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleService } from 'src/role/role.service';
import { Permissions } from 'src/common/decorators/permissions.decorators';
import { UserResponseDto } from './dto/getAllUsersResponseDto';
import { ChangePasswordDto } from './dto/changePasswordDto';
import { NotificationService } from 'src/notification/notification.service';
import { Order } from 'src/common/types/order';
import { AuthService } from 'src/auth/auth.service';

@ApiBearerAuth()
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @Permissions(Permission.ViewUsers)
  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userService.getAllUsers();

    //removing sensitive data
    const publicUsersData = users.map(({ password, ...rest }) => rest);
    return publicUsersData;
  }

  @Get('/technicians')
  @Permissions(Permission.ViewOrders)
  async getAllTechnicians(): Promise<UserResponseDto[]> {
    const technicians = await this.userService.getAllTechnicians();

    //removing sensitive data
    const publicTechniciansData = technicians.map(
      ({ password, ...rest }) => rest,
    );

    return publicTechniciansData;
  }

  @Get('/designers')
  @Permissions(Permission.AssignDesigner)
  async getAllDesigners(): Promise<UserResponseDto[]> {
    const designers = await this.userService.getAllDesigners();

    //removing sensitive data
    const publicDesignersData = designers.map(({ password, ...rest }) => rest);

    return publicDesignersData;
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Permissions(Permission.ViewUsers)
  async getUserById(@Param('id') id: string): Promise<User> {
    const userFound = await this.userService.getUserById(Number(id));
    if (!userFound) throw new NotFoundException('User not found');
    return userFound;
  }

  @Post()
  @Permissions(Permission.CreateUsers)
  async createUser(
    @Body() data: CreateUserDto,
    @Request() req,
  ): Promise<PublicUserData> {
    //checking if email was provided
    if (data.email) {
      //checking if email already exists
      const emailExists = await this.userService.getUserByEmail(data.email);
      if (emailExists) {
        throw new BadRequestException('Email already in use');
      }
    }

    //checking if username already exists
    const usernameExists = await this.userService.getUserByUsername(
      data.username,
    );
    if (usernameExists) {
      throw new BadRequestException('Username already in use');
    }

    //Normalizing data
    data.username = data.username.trim().toLowerCase();
    data.email = data.email.trim().toLowerCase();

    //cheking if roleExists
    const roleExists = await this.roleService.getRoleById(data.roleId);
    if (!roleExists) {
      throw new BadRequestException('Role not found');
    }

    //hashing password
    data.password = await bcrypt.hash(data.password, 10);

    //creating user
    //removing sensitive data from response
    const { password, ...rest } = await this.userService.createUser(data);

    //Notifying admin
    this.notificationService.notifyUser(req.user.sub, {
      message: `User ${data.name} created successfully`,
      type: 'SUCCESS',
    });

    return rest;
  }

  @Patch(':id')
  @Permissions(Permission.UpdateUsers)
  async updateUser(
    @Param('id') id: string,
    @Body() data: User,
    @Request() req,
  ): Promise<User> {
    try {
      //Updating user
      const updatedUser = await this.userService.updateUser(Number(id), data);

      //Notifying admin
      this.notificationService.notifyUser(req.user.sub, {
        message: `User ${updatedUser.name} updated successfully`,
        type: 'SUCCESS',
      });
      return updatedUser;
    } catch (err) {
      throw new NotFoundException("User doesn't exist");
    }
  }

  @Patch(':id/activate')
  @Permissions(Permission.UpdateUsers)
  async activateUser(
    @Param('id') id: string,
    @Body() data: User,
    @Request() req,
  ): Promise<User> {
    try {
      //Updating user
      const updatedUser = await this.userService.updateUser(Number(id), {
        ...data,
        disabled: false,
      });

      //Notifying admin
      this.notificationService.notifyUser(req.user.sub, {
        message: `User ${updatedUser.name} activated successfully`,
        type: 'SUCCESS',
      });
      return updatedUser;
    } catch (err) {
      throw new NotFoundException("User doesn't exist");
    }
  }

  @Patch(':id/deactivate')
  @Permissions(Permission.UpdateUsers)
  async deactivateUser(
    @Param('id') id: string,
    @Body() data: User,
    @Request() req,
  ): Promise<User> {
    try {
      //Updating user
      const updatedUser = await this.userService.updateUser(Number(id), {
        ...data,
        disabled: true,
      });

      //Notifying admin
      this.notificationService.notifyUser(req.user.sub, {
        message: `User ${updatedUser.name} deactivated successfully`,
        type: 'SUCCESS',
      });
      return updatedUser;
    } catch (err) {
      throw new NotFoundException("User doesn't exist");
    }
  }

  @Patch(':id/password')
  @Permissions(Permission.UpdateUsers)
  async changePassword(
    @Param('id') id: string,
    @Body() data: ChangePasswordDto,
  ): Promise<boolean> {
    try {
      //hashing password
      const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);

      //Changing password
      await this.userService.changePassword(Number(id), hashedNewPassword);
      return true;
    } catch (err) {
      console.error(err);
      throw new NotFoundException("User doesn't exist");
    }
  }

  @Delete(':id')
  @Permissions(Permission.DeleteUsers)
  async deleteUser(
    @Param('id') id: string,
    @Request() req,
  ): Promise<PublicUserData> {
    try {
      const userDeleted = await this.userService.deleteUser(Number(id));
      const { id: userId, password, ...rest } = userDeleted;

      this.notificationService.notifyUser(req.user.sub, {
        message: `User ${userDeleted.name} deleted successfully`,
        type: 'SUCCESS',
      });
      return rest;
    } catch (err) {
      throw new NotFoundException("User doesn't exist");
    }
  }

  @Post(':id/can-be-deactivated')
  async canBeDeactivated(
    @Param('id') id: number,
  ): Promise<{ canBeDeactivated: boolean; data: Order[] }> {
    const result = await this.userService.havePendingTasks(id);
    return result;
  }

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
    throw new NotImplementedException();

    const userLoggedIn = await this.authService.getUserLoggedIn(req);

    const user = await this.userService.getUserById(userLoggedIn.sub);

    return {
      rowsPerPage: 0,
    };
  }
}
