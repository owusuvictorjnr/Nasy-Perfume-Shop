import {
  Controller,
  Get,
  Put,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import * as admin from 'firebase-admin';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request & { user: any }) {
    const userId = req.user.id;
    const user = await this.usersService.findById(userId);
    return user;
  }

  @UseGuards(FirebaseAuthGuard)
  @Put('me')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Req() req: Request & { user: any },
    @Body()
    data: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      avatar?: string;
    },
  ) {
    const userId = req.user.id;
    const user = await this.usersService.updateProfile(userId, data);
    return user;
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('me/orders')
  async getUserOrders(@Req() req: Request & { user: any }) {
    const userId = req.user.id;
    const orders = await this.usersService.getUserOrders(userId);
    return orders;
  }
}
