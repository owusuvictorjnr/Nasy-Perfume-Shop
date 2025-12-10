import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

// Load .env from the backend root so DATABASE_URL is available to Prisma commands
dotenv.config({ path: process.cwd() + '/.env' });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is not set. Create a .env file in the backend folder with DATABASE_URL or run the migrate command with the env var set.',
  );
}

export default defineConfig({
  datasource: {
    url: databaseUrl,
  },
});
