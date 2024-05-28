import email, { emailFrom } from '@/service/email';
import Http, { context } from '@/service/http';
import TemplateForgotPassword from '@/templates/emails/forgot-password';
import { t } from 'elysia';

export const forgot = new Http().use(context).post(
  '/forgot-password',
  async ({ body: { email: value }, error, db }) => {
    const data = await db.users.findUnique({
      where: {
        email: value,
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
    type: 'application/json',
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
);
