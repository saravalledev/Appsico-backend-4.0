import Http, { context } from '@/service/http';
import type { Prisma } from '@prisma/client';
import { t } from 'elysia';
import { last } from './last';

export const slots = new Http({
  prefix: '/slots',
})
  .use(context)
  .get(
    '/:user',
    async ({ params: { user }, db }) => {
      const where: Prisma.ConversationsWhereInput = {
        users: {
          some: {
            id: user,
          },
        },
        messages: {
          some: {
            content: {},
          },
        },
      };

      const data = await db.conversations.findMany({
        where,
        distinct: 'id',
        select: {
          id: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      return {
        data: data.flatMap((item) => item.id),
      };
    },
    {
      response: t.Object({
        data: t.Array(t.String()),
      }),
      params: t.Object({
        user: t.String(),
      }),
    }
  )
  .use(last);
