import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import type { NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function middleware(req: NextRequest) {
  const links = await prisma.link.findMany({});

  return new Response(JSON.stringify(links), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
