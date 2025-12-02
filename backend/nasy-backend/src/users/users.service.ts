import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findByFirebaseId(uid: string) {
    return this.repo.findOne({ where: { firebaseUid: uid } });
  }

  async syncFirebaseUser(data: { uid: string; email?: string; name?: string }) {
    let user = await this.findByFirebaseId(data.uid);

    if (!user) {
      const nameParts = (data.name ?? '').split(' ');
      user = this.repo.create({
        firebaseUid: data.uid,
        email: data.email,
        firstName: nameParts[0] ?? '',
        middleName: nameParts.length === 3 ? nameParts[1] : '',
        lastName: nameParts.length >= 2 ? nameParts.slice(-1)[0] : '',
      });
      return this.repo.save(user);
    }
    return user;
  }
}
