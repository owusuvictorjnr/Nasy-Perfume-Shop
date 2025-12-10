import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { OrdersService } from './orders.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CreateOrderDto, VerifyPaymentDto } from './dto/create-order.dto';

@Controller('orders')
@UseGuards(FirebaseAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('verify-payment')
  @HttpCode(HttpStatus.OK)
  async verifyPayment(
    @Req() req: Request & { user: any },
    @Body() data: VerifyPaymentDto,
  ) {
    const userId = req.user.id;
    return this.ordersService.verifyAndCreateOrder(userId, data.reference);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @Req() req: Request & { user: any },
    @Body() data: CreateOrderDto,
  ) {
    const userId = req.user.id;
    return this.ordersService.createOrderWithPaystack(userId, data);
  }

  @Post('legacy')
  @HttpCode(HttpStatus.CREATED)
  async createLegacyOrder(
    @Req() req: Request & { user: any },
    @Body()
    data: {
      shippingAddressId: string;
      billingAddressId?: string;
      customerNote?: string;
    },
  ) {
    const userId = req.user.id;
    return this.ordersService.createOrder(userId, data);
  }

  @Get()
  async getUserOrders(@Req() req: Request & { user: any }) {
    const userId = req.user.id;
    return this.ordersService.getUserOrders(userId);
  }

  @Get(':id')
  async getOrder(
    @Req() req: Request & { user: any },
    @Param('id') orderId: string,
  ) {
    const userId = req.user.id;
    return this.ordersService.getOrderById(userId, orderId);
  }

  @Put(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelOrder(
    @Req() req: Request & { user: any },
    @Param('id') orderId: string,
  ) {
    const userId = req.user.id;
    return this.ordersService.cancelOrder(userId, orderId);
  }
}
