import Http, { context } from '@/service/http';
import { t } from 'elysia';

export const specialties = new Http().use(context).get(
  '/specialties',
  async ({ db }) => {
    const response = await db.specialties.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return response;
  },
  {
    response: t.Array(
      t.Object({
        id: t.String(),
        name: t.String(),
      })
    ),
  }
);
