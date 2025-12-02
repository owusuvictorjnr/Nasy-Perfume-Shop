import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    if (!admin.apps.length) {
      const keyEnv = process.env.FIREBASE_ADMIN_KEY;
      if (!keyEnv) {
        throw new Error('FIREBASE_ADMIN_KEY is not set');
      }
      let parsedKey: admin.ServiceAccount;
      try {
        const parsedUnknown = JSON.parse(keyEnv) as unknown;
        if (typeof parsedUnknown !== 'object' || parsedUnknown === null) {
          throw new Error('FIREBASE_ADMIN_KEY does not contain a JSON object');
        }
        // parsedUnknown is unknown so casting to admin.ServiceAccount is safe from `any` assignment lint rules
        parsedKey = parsedUnknown as admin.ServiceAccount;
      } catch (err) {
        // include the original error message to aid debugging
        const message = err instanceof Error ? err.message : String(err);
        throw new Error('FIREBASE_ADMIN_KEY contains invalid JSON: ' + message);
      }
      admin.initializeApp({
        credential: admin.credential.cert(parsedKey),
      });
    }
  }
}
