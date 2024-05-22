import Http, { context } from '@/service/http';
import { Prisma, TypeServicesEnum } from '@prisma/client';
import { t } from 'elysia';

export const findMany = new Http().use(context).get(
  '/',
  async ({ query, db }) => {
    const take = query.limit ? Number(query.limit) : 30;

    const where: Prisma.UsersWhereInput = {
      type: 'professional',
      profile: {
        isNot: query.validated === 'true' ? null : undefined,
      },
      name: query.search
        ? {
            mode: 'insensitive',
            search: query.search.replaceAll(' ', '&'),
          }
        : undefined,
    };

    const [data, previous, total] = await db.$transaction([
      db.users.findMany({
        where,
        cursor: query.cursor
          ? {
              id: query.cursor,
            }
          : undefined,
        take: take + 1,
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
        orderBy: {
          id: 'asc',
        },
      }),
      db.users.findMany({
        where: {
          ...where,
          id: query.cursor
            ? {
                lt: query.cursor,
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
      db.users.count({
        where,
      }),
    ]);

    const nextId =
      data.length >= take
        ? data?.[data.length - 1]?.id || undefined
        : undefined;
    const previousId = previous?.[previous.length - 1]?.id || undefined;

    return {
      next: nextId,
      previous: query.cursor
        ? previousId === nextId
          ? undefined
          : previousId
        : undefined,
      data: data.slice(0, take).map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image || undefined,
        profile: item.profile
          ? {
              bio: item.profile.bio,
              approach: item.profile.approach,
              specialties: item.profile.specialties,
              service: item.profile.service,
            }
          : undefined,
      })),
      total,
    };
  },
  {
    response: t.Object({
      next: t.Optional(t.String()),
      previous: t.Optional(t.String()),
      data: t.Array(
        t.Object({
          id: t.String(),
          name: t.String(),
          image: t.Optional(t.String()),
          profile: t.Optional(
            t.Object({
              bio: t.String(),
              approach: t.Optional(
                t.Array(
                  t.Object({
                    id: t.String(),
                    name: t.String(),
                  })
                )
              ),
              specialties: t.Optional(
                t.Array(
                  t.Object({
                    id: t.String(),
                    name: t.String(),
                  })
                )
              ),
              service: t.Array(t.Enum(TypeServicesEnum)),
            })
          ),
        })
      ),
      total: t.Number(),
    }),
    query: t.Optional(
      t.Object({
        cursor: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        search: t.Optional(t.String()),
        validated: t.Optional(t.String()),
      })
    ),
  }
);
