import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as admin from 'firebase-admin';
import { User } from 'src/users/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async syncFirebaseUser(decoded: admin.auth.DecodedIdToken) {
    const firebaseUid = decoded.uid;

    // Check if exists
    let user = await this.repo.findOne({ where: { firebaseUid } });

    if (user) {
      return user;
    }

    // Create user
    const email = typeof decoded.email === 'string' ? decoded.email : undefined;
    const nameFromToken =
      typeof decoded.name === 'string' ? decoded.name : undefined;
    const provider =
      decoded.firebase && typeof decoded.firebase.sign_in_provider === 'string'
        ? decoded.firebase.sign_in_provider
        : 'unknown';
    const avatar =
      typeof decoded.picture === 'string' ? decoded.picture : undefined;

    user = this.repo.create({
      firebaseUid,
      email,
      name: nameFromToken ?? (email ? email.split('@')[0] : undefined),
      provider,
      avatar,
    } as Partial<User>);

    return await this.repo.save(user);
  }
}
