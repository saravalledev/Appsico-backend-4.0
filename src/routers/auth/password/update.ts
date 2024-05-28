import Http, { context } from '@/service/http';
import { t } from 'elysia';

export const updated = new Http().use(context).patch(
  '/:id',
  async ({ body: { current, password }, params: { id }, db, error }) => {
    const user = await db.users.findUnique({
      where: {
        id,
      },
      select: {
        password: true,
      },
    });

    if (!user) {
      return error('Bad Request', {
        message: 'Usuário não encontrado',
      });
    }

    const verify = await Bun.password.verify(current, user?.password);

    if (!verify) {
      return error('Bad Request', {
        message: 'Senha atual incorreta',
      });
    }

    await db.users.update({
      where: {
        id,
      },
      data: {
        password: await Bun.password.hash(password),
      },
    });

    return {
      message: 'Senha alterada com sucesso',
    };
  },
  {
    type: 'application/json',
    body: t.Object({
      current: t.String(),
      password: t.String(),
    }),
    response: {
      200: t.Object({
        message: t.String(),
      }),
      400: t.Object({
        message: t.String(),
      }),
    },
    params: t.Object({
      id: t.String(),
    }),
  }
);
