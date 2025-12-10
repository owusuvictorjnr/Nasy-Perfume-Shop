import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            tags: true,
          },
        },
        variant: true,
      },
    });

    // Calculate totals
    let subtotal = 0;
    cartItems.forEach((item) => {
      const price = item.variant
        ? item.variant.salePrice || item.variant.price
        : item.product?.salePrice || item.product?.basePrice || 0;
      subtotal += price * item.quantity;
    });

    return {
      items: cartItems,
      subtotal,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    };
  }

  async addToCart(
    userId: string,
    data: {
      productId: string;
      variantId?: string;
      quantity: number;
    },
  ) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    // Check if variant exists if provided
    if (data.variantId) {
      const variant = await this.prisma.productVariant.findUnique({
        where: { id: data.variantId },
      });

      if (!variant || variant.productId !== data.productId) {
        throw new BadRequestException('Variant not found');
      }
    }

    // Check if item already in cart
    const existing = await this.prisma.cartItem.findFirst({
      where: {
        userId,
        productId: data.productId,
        variantId: data.variantId || null,
      },
    });

    if (existing) {
      // Update quantity
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + data.quantity,
        },
        include: {
          product: true,
          variant: true,
        },
      });
    }

    // Create new cart item
    return this.prisma.cartItem.create({
      data: {
        userId,
        productId: data.productId,
        variantId: data.variantId,
        quantity: data.quantity,
      },
      include: {
        product: true,
        variant: true,
      },
    });
  }

  async updateCartItem(userId: string, itemId: string, quantity: number) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new BadRequestException('Cart item not found');
    }

    if (quantity <= 0) {
      return this.removeFromCart(userId, itemId);
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: true,
        variant: true,
      },
    });
  }

  async removeFromCart(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new BadRequestException('Cart item not found');
    }

    return this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async clearCart(userId: string) {
    return this.prisma.cartItem.deleteMany({
      where: { userId },
    });
  }
}
