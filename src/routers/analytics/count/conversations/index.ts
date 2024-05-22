import Http, { context } from '@/service/http';
import { t } from 'elysia';

export const conversations = new Http().use(context).get(
  '/conversations',
  async ({ db }) => {
    const data = await db.conversations.count({
      where: {
        messages: {},
      },
    });

    return {
      count: data,
    };
  },
  {
    response: t.Object({
      count: t.Number(),
    }),
  }
);
