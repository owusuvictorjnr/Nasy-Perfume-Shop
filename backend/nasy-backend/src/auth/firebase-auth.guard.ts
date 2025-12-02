import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { FirebaseService } from './firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private firebaseService: FirebaseService) {}
  async canActivate(context: ExecutionContext) {
    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: unknown }>();

    const header = req.headers.authorization;
    if (!header)
      throw new UnauthorizedException('Missing Authorization header');

    const token = header.replace('Bearer ', '').trim();
    const decoded = (await this.firebaseService.verifyToken(token)) as unknown;

    if (!decoded) throw new UnauthorizedException('Invalid or expired token');

    req.user = decoded;
    return true;
  }
}
