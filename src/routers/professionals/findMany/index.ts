import Http, { context } from '@/service/http';
import { Prisma, TypeServicesEnum } from '@prisma/client';
import { t } from 'elysia';

export const findMany = new Http().use(context).get(
  '/',
  async ({ query: { limit, cursor, validated, search, state, city }, db }) => {
    const take = limit ? Number(limit) : 30;

    const isMoreProfile = state || city;

    const where: Prisma.UsersWhereInput = {
      type: 'professional',
      profile: !validated
        ? isMoreProfile
          ? {
              address:
                state || city
                  ? {
                      state,
                      city,
                    }
                  : undefined,
            }
          : undefined
        : {
            isNot: null
          },
      name: search
        ? {
            mode: 'insensitive',
            search: search.replaceAll(' ', '&'),
          }
        : undefined,
    };

    const [data, previous, total] = await db.$transaction([
      db.users.findMany({
        where,
        cursor: cursor
          ? {
              id: cursor,
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
          id: 'desc',
        },
      }),
      db.users.findMany({
        where: {
          ...where,
        },
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        take: take + 1,
        select: {
          id: true,
        },
        orderBy: {
          id: 'asc',
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
      previous: cursor
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
      t.Partial(
        t.Object({
          cursor: t.String(),
          limit: t.String(),
          search: t.String(),
          validated: t.String(),
          state: t.String(),
          city: t.String(),
        })
      )
    ),
  }
);
