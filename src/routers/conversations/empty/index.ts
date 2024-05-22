import Http, { context } from '@/service/http';
import { t } from 'elysia';

export const empty = new Http({
  prefix: '/empty',
})
  .use(context)
  .get(
    '/:id',
    async ({ params: { id }, db }) => {
      const isConversations = await db.conversations.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
        },
      });

      return {
        empty: !isConversations,
      };
    },
    {
      response: t.Object({
        empty: t.Boolean(),
      }),
      params: t.Object({
        id: t.String(),
      }),
    }
  );
