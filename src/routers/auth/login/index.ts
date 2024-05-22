import Http, { context } from '@/service/http';
import { TypeUserEnum } from '@prisma/client';
import { t } from 'elysia';

export const login = new Http()
  .use(context)
  .post(
    '/login',
    async ({ body, error, db }) => {
      const data = await db.users.findUnique({
        where: {
          email: body.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          type: true,
          password: true,
        },
      });

      if (!data) {
        return error('Unauthorized', {
          message: 'Usuário não encontrado',
        });
      }

      const passwordValidate = await Bun.password.verify(
        body.password,
        data.password
      );

      if (!passwordValidate) {
        return error('Unauthorized', {
          message: 'Senha incorreta',
        });
      }

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        image: data.image,
        role: data.type,
      };
    },
    {
      type: 'json',
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
      response: {
        200: t.Object({
          id: t.String(),
          name: t.String(),
          email: t.String(),
          image: t.Nullable(t.Optional(t.String())),
          role: t.Enum(TypeUserEnum),
        }),
        401: t.Object({
          message: t.String(),
        }),
      },
    }
  )
  .onError(({ code, error }) => {
    let message = 'Falha ao logar';

    if (code === 'VALIDATION') {
      message = error.all[0].schema.error;
    }

    return {
      message,
    };
  });
