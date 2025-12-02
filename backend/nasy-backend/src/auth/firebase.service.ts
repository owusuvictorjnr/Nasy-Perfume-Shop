import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  async verifyToken(token: string) {
    try {
      return await admin.auth().verifyIdToken(token);
    } catch (error) {
      // Log the error to ensure the variable is used and aid debugging
      console.error('Firebase token verification failed:', error);
      return null;
    }
  }
}
