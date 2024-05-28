import Http, { context } from '@/service/http';
import { Prisma, TypeMessageEnum } from '@prisma/client';
import { t } from 'elysia';

const SchemaResponse = t.Array(
  t.Object({
    id: t.String(),
    type: t.Enum(TypeMessageEnum),
    sender: t.String(),
    content: t.String(),
    created_at: t.Date(),
  })
);

export const messages = new Http().use(context).get(
  '/:id/messages',
  async ({ params: { id }, query: { limit, cursor }, db }) => {
    const take = limit ? Number(limit) : 30;

    const where: Prisma.MessagesWhereInput = {
      conversationId: id,
    };

    const [data, previous, total] = await db.$transaction([
      db.messages.findMany({
        where,
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        take: take + 1,
        select: {
          id: true,
          type: true,
          content: true,
          sender: {
            select: {
              id: true,
            },
          },
          createdAt: true,
        },
        orderBy: {
          id: 'desc',
        },
      }),
      db.messages.findMany({
        where: {
          ...where,
          id: cursor
            ? {
                lt: cursor,
              }
            : undefined,
        },
        take: take,
        select: {
          id: true,
        },
        orderBy: {
          id: 'desc',
        },
      }),
      db.messages.count({
        where: {
          conversationId: id,
        },
      }),
    ]);

    const nextId =
      data.length >= take
        ? data?.[data.length - 1]?.id || undefined
        : undefined;
    const previousId = previous?.[previous.length - 1]?.id || undefined;

    return {
      next: nextId,
      previous: cursor
        ? previousId === nextId
          ? undefined
          : previousId
        : undefined,
      data: data.slice(0, take).map((item) => ({
        id: item.id,
        type: item.type,
        content: item.content,
        sender: item.sender.id,
        created_at: item.createdAt,
      })),
      total,
    };
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    response: t.Object({
      next: t.Optional(t.String()),
      previous: t.Optional(t.String()),
      data: SchemaResponse,
      total: t.Number(),
    }),
    query: t.Optional(
      t.Object({
        limit: t.Optional(t.Number()),
        cursor: t.Optional(t.String()),
      })
    ),
  }
);
