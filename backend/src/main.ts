import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { execSync } from 'child_process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS before listening
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Run migrations automatically on startup for Render
  try {
    console.log('Running auto-migrations...');

    const output = execSync('npx prisma migrate deploy');
    console.log('Migration output:', output.toString());
  } catch (error) {
    console.error('Migration failed:', error);
    // Don't crash, try to start anyway in case it's a transient issue or already migrated
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
