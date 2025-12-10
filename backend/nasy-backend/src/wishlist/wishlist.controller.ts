import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { WishlistService } from './wishlist.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('wishlist')
@UseGuards(FirebaseAuthGuard)
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  async getWishlist(@Req() req: Request & { user: any }) {
    const userId = req.user.id;
    return this.wishlistService.getWishlist(userId);
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  async addToWishlist(
    @Req() req: Request & { user: any },
    @Body() data: { productId: string },
  ) {
    const userId = req.user.id;
    return this.wishlistService.addToWishlist(userId, data.productId);
  }

  @Delete('items/:productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFromWishlist(
    @Req() req: Request & { user: any },
    @Param('productId') productId: string,
  ) {
    const userId = req.user.id;
    await this.wishlistService.removeFromWishlist(userId, productId);
  }
}
