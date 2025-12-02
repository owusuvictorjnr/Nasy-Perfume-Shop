import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import * as admin from 'firebase-admin';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@Controller('users')
export class UsersController {
  @UseGuards(FirebaseAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request & { user: admin.auth.DecodedIdToken }) {
    const name = typeof req.user.name === 'string' ? req.user.name : null;
    const picture =
      typeof req.user.picture === 'string' ? req.user.picture : null;
    const provider =
      req.user.firebase &&
      typeof req.user.firebase.sign_in_provider === 'string'
        ? req.user.firebase.sign_in_provider
        : null;

    return {
      uid: req.user.uid,
      email: req.user.email,
      name,
      picture,
      provider,
    };
  }
}
