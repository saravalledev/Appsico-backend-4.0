import Http, { context } from '@/service/http';
import { TypeMessageEnum } from '@prisma/client';
import { t } from 'elysia';

export const last = new Http().use(context).get(
  '/:user/:conversation',
  async ({ params: { conversation }, db, error }) => {
    const data = await db.conversations.findUnique({
      where: {
        id: conversation,
        messages: {
          some: {},
        },
      },
      select: {
        id: true,
        users: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            id: true,
            type: true,
            content: true,
            createdAt: true,
          },
        },
        createdAt: true,
      },
    });

    if (!data) {
      return error('Not Found', {
        message: 'Conversa não encontrada',
      });
    }

    return {
      id: data.id,
      users: data.users.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image || undefined,
      })),
      messages: {
        id: data.messages[0].id,
        type: data.messages[0].type,
        content: data.messages[0].content,
        created_at: data.messages[0].createdAt,
      },
      created_at: data.createdAt,
    };
  },
  {
    params: t.Object({
      conversation: t.String(),
      user: t.String(),
    }),
    response: {
      200: t.Object({
        id: t.String(),
        users: t.Array(
          t.Object({
            id: t.String(),
            name: t.String(),
            image: t.Optional(t.String()),
          })
        ),
        messages: t.Object({
          id: t.String(),
          type: t.Enum(TypeMessageEnum),
          content: t.String(),
          created_at: t.Date(),
        }),
        created_at: t.Date(),
      }),
      404: t.Object({
        message: t.String(),
      }),
    },
  }
);
