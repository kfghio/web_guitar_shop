import { Module } from '@nestjs/common';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { FirebaseService } from './firebase.service';

@Module({
  providers: [FirebaseAuthGuard, FirebaseService],
  exports: [FirebaseAuthGuard, FirebaseService],
})
export class AuthModule {}
