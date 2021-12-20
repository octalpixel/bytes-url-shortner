import { createRouter } from 'server/createRouter';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const linkRouter = createRouter()
  // get all links
  .query('getAll', {
    async resolve({ ctx }) {
      return ctx.prisma.link.findMany({
        orderBy: {
          createdAt: 'desc',
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

      const post = await ctx.prisma.link.findUnique({
        where: { id },
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Link not found',
        });
      }

      return post;
    },
  })
  .mutation('add', {
    input: z.object({
      destinationUrl: z.string(),
      slug: z.string(),
    }),
    async resolve({ ctx: { prisma }, input }) {
      const { slug, destinationUrl } = input;

      const existingSlug = await prisma?.link.findFirst({
        where: {
          shortSlug: slug,
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
        },
      });

      return newLink;
    },
  });
