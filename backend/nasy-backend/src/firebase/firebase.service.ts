import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private firebaseApp: admin.app.App;
  // Firebase service implementation

  constructor() {
    if (admin.apps.length === 0) {
      const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      if (!serviceAccountJson) {
        throw new Error(
          'FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set',
        );
      }
      const serviceAccount = JSON.parse(
        serviceAccountJson,
      ) as admin.ServiceAccount;
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      this.firebaseApp = admin.app();
    }
  }

  async verifyIdToken(idToken: string) {
    return await this.firebaseApp.auth().verifyIdToken(idToken);
  }
}
