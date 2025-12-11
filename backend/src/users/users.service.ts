import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async syncFirebaseUser(decoded: admin.auth.DecodedIdToken) {
    const firebaseUid = decoded.uid;

    // Check if user exists by Firebase UID
    let user = await this.prisma.user.findFirst({
      where: { id: firebaseUid },
    });

    if (user) {
      return user;
    }

    // Extract user data from Firebase token
    const email = typeof decoded.email === 'string' ? decoded.email : '';
    const nameFromToken =
      typeof decoded.name === 'string' ? decoded.name : undefined;
    const avatar =
      typeof decoded.picture === 'string' ? decoded.picture : undefined;

    // Split name into first and last name
    let firstName = '';
    let lastName = '';
    if (nameFromToken) {
      const nameParts = nameFromToken.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    } else if (email) {
      firstName = email.split('@')[0];
    }

    // Create new user with Firebase UID as the primary ID
    user = await this.prisma.user.create({
      data: {
        id: firebaseUid, // Use Firebase UID as primary key
        uid: firebaseUid, // Also set uid field
        email,
        password: '', // Empty password since we use Firebase auth
        firstName,
        lastName,
        avatar,
        role: 'CUSTOMER',
      },
    });

    return user;
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: {
          include: {
            items: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      avatar?: string;
    },
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
