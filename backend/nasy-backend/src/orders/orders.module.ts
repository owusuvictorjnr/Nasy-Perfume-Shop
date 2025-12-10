import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CartModule } from '../cart/cart.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PaystackService } from './paystack.service';

@Module({
  imports: [AuthModule, CartModule],
  controllers: [OrdersController],
  providers: [OrdersService, PaystackService],
  exports: [OrdersService],
})
export class OrdersModule {}
