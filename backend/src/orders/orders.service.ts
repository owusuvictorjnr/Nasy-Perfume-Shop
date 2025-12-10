import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { PaystackService } from './paystack.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
    private paystackService: PaystackService,
  ) {}

  async createOrder(
    userId: string,
    data: {
      shippingAddressId: string;
      billingAddressId?: string;
      customerNote?: string;
    },
  ) {
    // Get cart items
    const cart = await this.cartService.getCart(userId);

    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Verify addresses exist
    const shippingAddress = await this.prisma.address.findFirst({
      where: { id: data.shippingAddressId, userId },
    });

    if (!shippingAddress) {
      throw new BadRequestException('Shipping address not found');
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Get user email
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // Calculate totals
    const subtotal = cart.subtotal;
    const shippingTotal = 0; // TODO: Calculate shipping
    const taxTotal = 0; // TODO: Calculate tax
    const total = subtotal + shippingTotal + taxTotal;

    // Create order with items
    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        customerEmail: user?.email || '',
        customerNote: data.customerNote,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        fulfillmentStatus: 'UNFULFILLED',
        subtotal,
        shippingTotal,
        taxTotal,
        total,
        shippingAddressId: data.shippingAddressId,
        billingAddressId: data.billingAddressId || data.shippingAddressId,
        items: {
          create: cart.items.map((item) => {
            const price = item.variant
              ? item.variant.salePrice || item.variant.price
              : item.product?.salePrice || item.product?.basePrice || 0;

            return {
              productId: item.productId,
              variantId: item.variantId,
              productName: item.product?.name || '',
              variantName: item.variant?.name,
              sku: item.variant?.sku || item.product?.sku || '',
              quantity: item.quantity,
              price,
              subtotal: price * item.quantity,
            };
          }),
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
        billingAddress: true,
      },
    });

    // Clear cart
    await this.cartService.clearCart(userId);

    return order;
  }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
        billingAddress: true,
      },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    return order;
  }

  async cancelOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.status !== 'PENDING' && order.status !== 'PROCESSING') {
      throw new BadRequestException('Order cannot be cancelled');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
      include: {
        items: true,
        shippingAddress: true,
      },
    });
  }

  async verifyAndCreateOrder(userId: string, paystackReference: string) {
    // Verify payment with Paystack
    const paymentData =
      await this.paystackService.verifyPayment(paystackReference);

    if (!paymentData || paymentData.status !== 'success') {
      throw new BadRequestException('Payment verification failed');
    }

    // Check if order already exists with this reference
    const existingOrder = await this.prisma.order.findFirst({
      where: { paystackReference },
    });

    if (existingOrder) {
      return existingOrder;
    }

    // Get cart
    const cart = await this.cartService.getCart(userId);
    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const subtotal = cart.subtotal;
    const shippingTotal = paymentData.metadata?.shipping || 0;
    const taxTotal = paymentData.metadata?.tax || 0;
    const total = paymentData.amount / 100; // Convert from pesewas to GHS

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        customerEmail: user?.email || paymentData.customer?.email || '',
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        fulfillmentStatus: 'UNFULFILLED',
        subtotal,
        shippingTotal,
        taxTotal,
        total,
        paystackReference,
        paymentMethod: 'Paystack',
        items: {
          create: cart.items.map((item) => {
            const price = item.variant
              ? item.variant.salePrice || item.variant.price
              : item.product?.salePrice || item.product?.basePrice || 0;

            return {
              productId: item.productId,
              variantId: item.variantId,
              productName: item.product?.name || '',
              variantName: item.variant?.name,
              sku: item.variant?.sku || item.product?.sku || '',
              quantity: item.quantity,
              price,
              subtotal: price * item.quantity,
            };
          }),
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    // Clear cart after successful order
    await this.cartService.clearCart(userId);

    return order;
  }

  async createOrderWithPaystack(userId: string, data: CreateOrderDto) {
    // Verify payment first
    const paymentData = await this.paystackService.verifyPayment(
      data.paystackReference,
    );

    if (!paymentData || paymentData.status !== 'success') {
      throw new BadRequestException('Payment verification failed');
    }

    // Check if order already exists
    const existingOrder = await this.prisma.order.findFirst({
      where: { paystackReference: data.paystackReference },
    });

    if (existingOrder) {
      return existingOrder;
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create or find shipping address
    let shippingAddressId: string | null = null;
    if (data.shippingAddress) {
      const address = await this.prisma.address.create({
        data: {
          userId,
          fullName:
            `${data.shippingAddress.firstName} ${data.shippingAddress.lastName}`.trim(),
          street: data.shippingAddress.address,
          city: data.shippingAddress.city,
          state: data.shippingAddress.state,
          country: data.shippingAddress.country,
          postalCode: data.shippingAddress.zipCode,
          phone: data.shippingAddress.phone,
        },
      });
      shippingAddressId = address.id;
    }

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        customerEmail: user?.email || data.shippingAddress?.email || '',
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        fulfillmentStatus: 'UNFULFILLED',
        subtotal: data.subtotal,
        shippingTotal: data.shipping,
        taxTotal: data.tax,
        total: data.total,
        paystackReference: data.paystackReference,
        paymentMethod: 'Paystack',
        shippingAddressId,
        billingAddressId: shippingAddressId,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: '', // Will be filled from product lookup if needed
            sku: '',
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
      },
    });

    // Clear cart
    await this.cartService.clearCart(userId);

    return order;
  }
}
