import Http, { context } from '@/service/http';
import { t } from 'elysia';

export const approach = new Http().use(context).get(
  '/approach',
  async ({ db }) => {
    const response = await db.approach.findMany({
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
