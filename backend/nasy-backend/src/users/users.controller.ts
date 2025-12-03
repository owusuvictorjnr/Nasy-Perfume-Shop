import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import * as admin from 'firebase-admin';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
// import { PrismaService } from '../prisma/prisma.service';

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

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';
// import { User } from 'src/users/user.entity';
// import { UsersModule } from 'src/users/users.module';
// import { AuthModule } from 'src/auth/auth.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: '.env',
//     }),

//     // PostgreSQL connection
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: process.env.DB_HOST ?? 'localhost',
//       port: Number(process.env.DB_PORT ?? 5432),
//       username: process.env.DB_USER,
//       password: process.env.DB_PASS,
//       database: process.env.DB_NAME,
//       entities: [User],
//       synchronize: true, // turn OFF in production
//     }),

//     UsersModule,
//     AuthModule,
//   ],
// })
// export class AppModule {}
