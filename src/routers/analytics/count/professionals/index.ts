import Http, { context } from '@/service/http';
import { t } from 'elysia';

export const professionals = new Http().use(context).get(
  '/professionals',
  async ({ db }) => {
    const data = await db.users.count({
      where: {
        type: 'professional',
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
