import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import prisma from 'utils/prisma';

import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log(`req.nextUrl`, req.nextUrl);

  if (
    pathname.startsWith('/app') ||
    pathname.startsWith('/404') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.rewrite(`${pathname}`);
  }

  const shortSlug = pathname.split('/')[1];

  if (!shortSlug || shortSlug.length <= 0) {
    return NextResponse.rewrite(`/`);
  }

  const link = await prisma.link.findFirst({
    where: {
      shortSlug: shortSlug,
    },
  });

  if (!link) {
    return NextResponse.rewrite(`${pathname}`);
  } else {
    return NextResponse.redirect(link.url);
  }
}
