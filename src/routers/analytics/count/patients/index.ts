import Http, { context } from '@/service/http';
import { t } from 'elysia';

export const patients = new Http().use(context).get(
  '/patients',
  async ({ db }) => {
    const data = await db.users.count({
      where: {
        type: 'patient',
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
