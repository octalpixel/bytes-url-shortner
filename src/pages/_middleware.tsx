import type { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function  middleware(req: NextRequest) {
//   const links = await prisma.f
}
