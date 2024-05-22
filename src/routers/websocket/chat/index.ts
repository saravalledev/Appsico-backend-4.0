import Http, { context } from '@/service/http';
import { TypeMessageEnum } from '@prisma/client';
import { t, type Static } from 'elysia';

const SchemaBody = t.Object({
  id: t.String(),
  type: t.Enum(TypeMessageEnum),
  content: t.String(),
  sender: t.String(),
});

const SchemaResponse = t.Object({
  id: t.String(),
  type: t.Enum(TypeMessageEnum),
  sender: t.Object({
    id: t.String(),
    name: t.String(),
    image: t.Optional(t.String()),
  }),
  message: t.String(),
  created_at: t.Date(),
});
type TypeResponse = Static<typeof SchemaResponse>;

export const connectById = new Http().use(context).ws('/:id', {
  open(ws) {
    console.log(ws)
    ws.subscribe(`chat-${ws.data.params.id}`);
  },
  close(ws) {
    ws.unsubscribe(`chat-${ws.data.params.id}`);
  },
  async message(ws, message) {
    console.log(message);
    const data = await ws.data.db.messages.create({
      data: {
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

    const response: TypeResponse = {
      id: data.id,
      type: data.type,
      sender: {
        id: data.sender.id,
        name: data.sender.name,
        image: data.sender.image || undefined,
      },
      message: data.content,
      created_at: data.createdAt,
    };

    ws.publish(`chat-${ws.data.params.id}`, response);
    ws.send(response);
  },
  body: SchemaBody,
  response: SchemaResponse,
});
