import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryService } from './cloudinary.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [AuthModule],
  providers: [CloudinaryService, UploadController],
  controllers: [UploadController],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
