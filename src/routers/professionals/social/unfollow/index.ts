import Http, { context } from '@/service/http';
import { t } from 'elysia';

export const unfollow = new Http().use(context).patch(
  '/unfollow',
  async ({ body: { user }, params: { id }, db }) => {
    await db.users.update({
      where: {
        id,
      },
      data: {
        followers: {
          disconnect: {
            id: user,
          },
        },
      },
    });

    return {
      message: 'Deixou de seguir',
    };
  },
  {
    type: 'application/json',
    body: t.Object({
      user: t.String(),
    }),
    params: t.Object({
      id: t.String(),
    }),
    response: t.Object({
      message: t.String(),
    }),
  }
);
