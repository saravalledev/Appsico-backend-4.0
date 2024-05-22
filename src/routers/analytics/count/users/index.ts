import Http, { context } from '@/service/http';
import { t } from 'elysia';

export const users = new Http().use(context).get(
  '/users',
  async ({ db }) => {
    const data = await db.users.count({
      where: {
        type: {
          in: ['patient', 'professional'],
        },
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
