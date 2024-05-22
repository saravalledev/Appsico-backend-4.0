import email, { emailFrom } from '@/service/email';
import Http, { context } from '@/service/http';
import TemplateWelcomeProfile from '@/templates/emails/wecome';

import { Prisma, TypeUserEnum } from '@prisma/client';

import { t } from 'elysia';

export const register = new Http()
  .use(context)
  .post(
    '/register',
    async ({ body, error, db, set }) => {
      if (body.type === 'professional' && !body.registration) {
        return error('Bad Request', {
          message: 'Informe seu CRP',
        });
      }

      await db.$transaction(async (db) => {
        await db.users.create({
          data: {
            type: body.type,
            name: body.name,
            email: body.email,
            phone: body.phone,
            password: await Bun.password.hash(body.password),
            registration: body.registration,
          },
        });

        await email.emails.send({
          from: emailFrom,
          to: body.email,
          subject: 'Boas vindas ao Appsico!',
          react: TemplateWelcomeProfile(),
        });
      });

      set.status = 'Created';
      return {
        message: 'Usuário cadastrado',
      };
    },
    {
      body: t.Object({
        type: t.Enum(TypeUserEnum, {
          error: 'Preencha o tipo de usuário',
        }),
        name: t.String({
          error: 'Preencha o nome completo',
        }),
        email: t.String({
          error: 'Preencha o e-mail',
        }),
        phone: t.String({
          error: 'Preencha o celular',
        }),
        password: t.String({
          error: 'Preencha a senha',
        }),
        registration: t.Optional(
          t.String({
            error: 'Preencha o CRP',
          })
        ),
      }),
      response: {
        200: t.Object({
          message: t.String(),
        }),
        400: t.Object({
          message: t.String(),
          description: t.Optional(t.String()),
        }),
      },
      type: 'json',
    }
  )
  .onError(({ code, error }) => {
    let message = 'Falha ao cadastrar';

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.meta?.target as string[]) {
        const errors = error.meta?.target as string[] | undefined;

        if (errors?.includes('email')) {
          message = 'E-mail já registrado';
        }

        if (errors?.includes('phone')) {
          message = 'Celular já registrado';
        }
      }
    }

    if (code === 'VALIDATION') {
      message = error.all[0].schema.error;
    }

    return {
      message,
    };
  });
