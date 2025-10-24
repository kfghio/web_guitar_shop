import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FirebaseService implements OnApplicationBootstrap {
  public admin = admin;

  onApplicationBootstrap() {
    const serviceAccount = JSON.parse(
      readFileSync(
        join(process.cwd(), 'firebase-service-account.json'),
        'utf8',
      ),
    );

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase инициализирован!');
    }
  }


  async setCustomClaims(uid: string, claims: Record<string, any>): Promise<void> {
    try {
      await this.admin.auth().setCustomUserClaims(uid, claims);
      console.log(`Custom claims установлены для пользователя ${uid}`);
    } catch (error) {
      console.error('Ошибка при установке custom claims:', error);
      throw new Error('Не удалось установить custom claims');
    }
  }

  async setAdminRole(uid: string): Promise<void> {
    await this.setCustomClaims(uid, { roles: ['admin'] });
  }

  async hasRole(uid: string, role: string): Promise<boolean> {
    try {
      const user = await this.admin.auth().getUser(uid);
      const roles = user.customClaims?.roles || [];
      return roles.includes(role);
    } catch (error) {
      console.error('Ошибка при проверке роли:', error);
      return false;
    }
  }

  async getUserRoles(uid: string): Promise<string[]> {
    try {
      const user = await this.admin.auth().getUser(uid);
      return user.customClaims?.roles || [];
    } catch (error) {
      console.error('Ошибка при получении ролей:', error);
      return [];
    }
  }

  async clearCustomClaims(uid: string): Promise<void> {
    await this.setCustomClaims(uid, {});
  }
}
