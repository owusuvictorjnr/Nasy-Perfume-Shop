import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { FirebaseService } from './firebase.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private firebaseService: FirebaseService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: unknown }>();

    const header = req.headers.authorization;
    if (!header)
      throw new UnauthorizedException('Missing Authorization header');

    const token = header.replace('Bearer ', '').trim();
    const decoded = await this.firebaseService.verifyIdToken(token);

    if (!decoded) throw new UnauthorizedException('Invalid or expired token');

    // Sync user with database
    const user = await this.usersService.syncFirebaseUser(decoded);

    // Attach full user object to request
    req.user = user;
    return true;
  }
}
