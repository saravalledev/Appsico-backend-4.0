import Http, { context } from '@/service/http';
import { t } from 'elysia';

export const verify = new Http().use(context).get(
  '/verify',
  async ({ params: { id }, db, query: { user } }) => {
    const subscriber = await db.users.findUnique({
      where: {
        id,
      },
      select: {
        followers: {
          where: {
            id: user,
          },
        },
      },
    });

    return !!subscriber?.followers.length;
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    query: t.Object({
      user: t.String(),
    }),
  }
);
