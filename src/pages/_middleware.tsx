import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import prisma from 'utils/prisma';

import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const { nextUrl, geo, ua, url } = req;
  const { pathname } = nextUrl;

  console.log(
    `{ nextUrl, geo, ua, url }`,
    JSON.stringify({ nextUrl, geo, ua, url }, null, 2),
  );

  console.log(`req.nextUrl`, req.nextUrl);
  console.log(`req.nextUrl`, req.nextUrl);

  if (
    pathname.startsWith('/links') ||
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
    event.waitUntil(
      (async () => {
        try {
          const hitIncrementPromise = prisma.link.update({
            where: {
              id: link.id,
            },

            data: {
              hits: {
                increment: 1,
              },
            },
          });

          const { country, region, city } = geo || {};

          const addVisitPromise = prisma.visit.create({
            data: {
              linkId: link.id,
              geoCity: city,
              geoCountry: country,
              geoRegion: region,
              browser: ua?.browser?.name,
              ua: ua?.ua,
              os: ua?.os?.name,
            },
          });

          await Promise.all([hitIncrementPromise, addVisitPromise]);
        } catch (error) {
          console.log(`error ==>`, error);
        }
      })(),
    );

    return NextResponse.redirect(link.url);
  }
}
