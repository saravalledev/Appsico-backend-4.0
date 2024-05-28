import Http from '@/service/http';

import { Prisma } from '@prisma/client';
import { routerAnalytics } from './analytics';
import { routerAuth } from './auth';
import { routerConversations } from './conversations';
import { routerProfessionals } from './professionals';
import { routerUsers } from './user';
import { routerUtils } from './utils';

export const routers = new Http({
  name: 'routers',
})
  .use(routerAuth)
  .use(routerConversations)
  .use(routerProfessionals)
  .use(routerUsers)
  .use(routerAnalytics)
  .use(routerUtils)
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
