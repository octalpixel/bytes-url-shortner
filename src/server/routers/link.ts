import { createRouter } from 'server/createRouter';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getHostFromURL } from 'utils/helper';

export const linkRouter = createRouter()
  // get all links
  .query('getAll', {
    async resolve({ ctx }) {
      return ctx.prisma.link.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          vists: true,
        },
      });
    },
  })
  .query('getById', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;

      const link = await ctx.prisma.link.findUnique({
        where: { id },
        select: {
          hits: true,
        },
      });

      if (!link) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Link not found',
        });
      }

      return link;
    },
  })
  .mutation('add', {
    input: z.object({
      destinationUrl: z.string(),
      slug: z.string(),
      domain: z.string().optional(),
    }),
    async resolve({ ctx: { prisma }, input }) {
      const { slug, destinationUrl, domain } = input;

      const existingSlug = await prisma?.link.findFirst({
        where: {
          shortSlug: slug,
          domain:
            domain ||
            getHostFromURL(process.env.NEXT_PUBLIC_BASE_DOMAIN as string),
        },
      });

      if (existingSlug) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Slug already exists',
        });
      }

      const newLink = await prisma?.link.create({
        data: {
          shortSlug: slug,
          url: destinationUrl,
          domain:
            domain ||
            getHostFromURL(process.env.NEXT_PUBLIC_BASE_DOMAIN as string),
        },
      });

      return newLink;
    },
  });
