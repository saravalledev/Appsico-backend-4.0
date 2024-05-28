import Http, { context } from '@/service/http';
import { t } from 'elysia';

export const states = new Http({
  prefix: '/states',
})
  .use(context)
  .get(
    '/',
    async ({ db }) => {
      const response = await db.address.findMany({
        where: {
          profile: {
            isNot: null,
          },
        },
        select: {
          state: true,
        },
        distinct: 'state',
        orderBy: {
          state: 'asc',
        },
      });

      return response.flatMap((item) => item.state);
    },
    {
      response: t.Array(t.String()),
    }
  )
  .get(
    '/:state',
    async ({ db, params }) => {
      const state = decodeURI(params.state);

      const response = await db.address.findMany({
        where: {
          profile: {
            user: {
              type: 'professional',
            },
          },
          state: state,
        },
        select: {
          city: true,
        },
        distinct: 'city',
        orderBy: {
          city: 'asc',
        },
      });

      return response.flatMap((item) => item.city);
    },
    {
      response: t.Array(t.String()),
    }
  );
