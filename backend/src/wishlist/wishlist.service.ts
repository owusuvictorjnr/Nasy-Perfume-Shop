import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(userId: string) {
    return this.prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            tags: true,
            variants: {
              take: 1,
              orderBy: { price: 'asc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addToWishlist(userId: string, productId: string) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    // Check if already in wishlist
    const existing = await this.prisma.wishlistItem.findFirst({
      where: { userId, productId },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.wishlistItem.create({
      data: { userId, productId },
      include: {
        product: {
          include: {
            category: true,
            tags: true,
            variants: {
              take: 1,
              orderBy: { price: 'asc' },
            },
          },
        },
      },
    });
  }

  async removeFromWishlist(userId: string, productId: string) {
    const item = await this.prisma.wishlistItem.findFirst({
      where: { userId, productId },
    });

    if (!item) {
      throw new BadRequestException('Item not in wishlist');
    }

    return this.prisma.wishlistItem.delete({
      where: { id: item.id },
    });
  }
}
