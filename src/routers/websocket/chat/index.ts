import Http, { context } from '@/service/http';
import { TypeMessageEnum } from '@prisma/client';
import { t, type Static } from 'elysia';
import { ulid } from 'ulidx';

const SchemaBody = t.Object({
  id: t.String(),
  type: t.Enum(TypeMessageEnum),
  content: t.String(),
  sender: t.String(),
});

const SchemaResponse = t.Object({
  id: t.String(),
  type: t.Enum(TypeMessageEnum),
  sender: t.String(),
  content: t.String(),
  created_at: t.Date(),
});
type TypeRequest = Static<typeof SchemaResponse>;

export const connectById = new Http({
  prefix: '/chat',
})
  .use(context)
  .ws('/:id', {
    open(ws) {
      ws.subscribe(`chat.${ws.data.params.id}`);
    },
    close(ws) {
      ws.unsubscribe(`chat.${ws.data.params.id}`);
    },
    async message(ws, message) {
      const id = ulid();
      const request: TypeRequest = {
        ...message,
        id: id,
        created_at: new Date(),
      };

      ws.publish(`chat.${ws.data.params.id}`, request);
      ws.send(request);

      await ws.data.db.messages.create({
        data: {
          id: id,
          conversationId: message.id,
          type: message.type,
          senderId: message.sender,
          content: message.content,
          viewers: [message.sender],
        },
        select: {
          id: true,
          type: true,
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          content: true,
          createdAt: true,
        },
      });
    },
    body: SchemaBody,
    response: SchemaResponse,
  });
