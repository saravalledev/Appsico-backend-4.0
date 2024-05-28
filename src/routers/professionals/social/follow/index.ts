import Http, { context } from '@/service/http';
import { t } from 'elysia';

export const follow = new Http().use(context).patch(
  '/follow',
  async ({ body: { user }, params: { id }, db }) => {
    await db.users.update({
      where: {
        id,
      },
      data: {
        followers: {
          connect: {
            id: user,
          },
        },
      },
    });

    return {
      message: 'Seguindo com sucesso',
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
