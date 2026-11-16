// Instancia única de Prisma Client para toda la aplicación
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
