import Http, { context } from '@/service/http';
import { t } from 'elysia';
import { last } from './last';

export const slots = new Http({
  prefix: '/slots',
})
  .use(context)
  .get(
    '/:user',
    async ({ params: { user }, db }) => {
      const data = await db.conversations.findMany({
        where: {
          users: {
            some: {
              id: user,
            },
          },
          messages: {
            some: {},
          },
        },
        distinct: 'id',
        select: {
          id: true,
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
