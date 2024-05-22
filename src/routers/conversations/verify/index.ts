import Http, { context } from '@/service/http';
import { t } from 'elysia';

export const verify = new Http().use(context).post(
  '/verify/:user1/:user2',
  async ({ params, db }) => {
    const isConversations = await db.conversations.findFirst({
      where: {
        users: {
          every: {
            id: {
              in: [params.user1, params.user2],
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (isConversations) {
      return {
        id: isConversations.id,
      };
    }

    const conversation = await db.conversations.create({
      data: {
        users: {
          connect: [params.user1, params.user2].map((item) => ({
            id: item,
          })),
        },
      },
      select: {
        id: true,
      },
    });

    return {
      id: conversation.id,
    };
  },
  {
    params: t.Object({
      user1: t.String(),
      user2: t.String(),
    }),
    response: {
      200: t.Object({
        id: t.String(),
      }),
    },
  }
);
