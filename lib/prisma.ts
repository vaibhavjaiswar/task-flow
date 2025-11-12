// import { PrismaClient } from '@prisma/client';
import { PrismaClient } from "@/prisma/generated/client";
import environment from "@/config/env";

const NODE_ENV = environment.NODE_ENV;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"], // optional logging
  });

if (NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// const prisma = new PrismaClient();

export default prisma;
