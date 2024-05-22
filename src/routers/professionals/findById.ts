import Http, { context } from '@/service/http';
import { error, t } from 'elysia';

export const findById = new Http().use(context).get(
  '/:id',
  async ({ params: { id }, db }) => {
    const response = await db.users.findUnique({
      where: {
        id,
        type: 'professional',
      },
      select: {
        id: true,
        name: true,
        image: true,
        profile: {
          select: {
            bio: true,
            socials: {
              select: {
                id: true,
                url: true,
              },
            },
            approach: {
              select: {
                id: true,
                name: true,
              },
            },
            specialties: {
              select: {
                id: true,
                name: true,
              },
            },
            service: true,
          },
        },
      },
    });

    if (!response) {
      return error('Bad Request', {
        message: 'Profissional não encontrado',
      });
    }

    return {
      id: response.id,
    };
  },
  {
    response: {
      200: t.Object({
        id: t.String(),
      }),
      400: t.Object({
        message: t.String(),
      }),
    },
  }
);
