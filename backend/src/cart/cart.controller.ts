import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { CartService } from './cart.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('cart')
@UseGuards(FirebaseAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  async getCart(@Req() req: Request & { user: any }) {
    const userId = req.user.id;
    return this.cartService.getCart(userId);
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  async addToCart(
    @Req() req: Request & { user: any },
    @Body()
    data: {
      productId: string;
      variantId?: string;
      quantity: number;
    },
  ) {
    const userId = req.user.id;
    return this.cartService.addToCart(userId, data);
  }

  @Put('items/:id')
  @HttpCode(HttpStatus.OK)
  async updateCartItem(
    @Req() req: Request & { user: any },
    @Param('id') itemId: string,
    @Body() data: { quantity: number },
  ) {
    const userId = req.user.id;
    return this.cartService.updateCartItem(userId, itemId, data.quantity);
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFromCart(
    @Req() req: Request & { user: any },
    @Param('id') itemId: string,
  ) {
    const userId = req.user.id;
    await this.cartService.removeFromCart(userId, itemId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearCart(@Req() req: Request & { user: any }) {
    const userId = req.user.id;
    await this.cartService.clearCart(userId);
  }
}
