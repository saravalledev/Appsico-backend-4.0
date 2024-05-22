import email, { emailFrom } from '@/service/email';
import Http, { context } from '@/service/http';
import TemplateForgotPassword from '@/templates/emails/forgot-password';
import { t } from 'elysia';

export const forgot = new Http()
  .use(context)
  .post(
    '/forgot-password',
    async ({ body, error, db }) => {
      const data = await db.users.findUnique({
        where: {
          email: body.email,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      if (!data) {
        return error('Unauthorized', {
          message: 'Usuário não encontrado',
        });
      }

      await email.emails.send({
        from: emailFrom,
        to: data.email,
        subject: 'Recuperação de conta - Appsico!',
        react: TemplateForgotPassword({}),
      });

      return {
        message: 'E-mail de recuperação enviado',
      };
    },
    {
      type: 'json',
      body: t.Object({
        email: t.String(),
      }),
      response: {
        200: t.Object({
          message: t.String(),
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
