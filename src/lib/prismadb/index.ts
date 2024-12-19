import { PrismaClient } from '@prisma/client';

declare global {
  /* eslint no-var: */
  var prisma: PrismaClient | undefined;
}

// Avoid instantiating too many instances of Prisma in development
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

const prismadb = db;
export default prismadb;
