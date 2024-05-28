import Http, { context } from '@/service/http';
import { Prisma, TypeServicesEnum } from '@prisma/client';
import { t } from 'elysia';

const SchemaQuery = t.Optional(
  t.Partial(
    t.Object({
      cursor: t.String(),
      limit: t.Number(),
      search: t.String(),
      validated: t.Boolean(),
      specialties: t.Union([t.Array(t.String()), t.String()]),
      approach: t.Union([t.Array(t.String()), t.String()]),
      services: t.Union([
        t.Array(t.Enum(TypeServicesEnum)),
        t.Enum(TypeServicesEnum),
      ]),
      state: t.String(),
      city: t.String(),
      exacts: t.Union([t.Array(t.String()), t.String()]),
      removes: t.Union([t.Array(t.String()), t.String()]),
    })
  )
);

const SchemaResponse = t.Object({
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
});

export const findMany = new Http().use(context).get(
  '/',
  async ({
    query: {
      limit,
      cursor,
      validated,
      search,
      specialties,
      approach,
      services,
      state,
      city,
      exacts,
      removes,
    },
    db,
  }) => {
    const take = limit ? Number(limit) : 30;

    const where: Prisma.UsersWhereInput = {
      type: 'professional',
    };

    if (!!search) {
      if (!where.profile) {
        where.profile = {};
      }

      where.name = {
        mode: 'insensitive',
        search: search.replaceAll(' ', '&'),
      };
    }

    if (!!specialties?.length) {
      if (!where.profile) {
        where.profile = {};
      }

      where.profile.specialties = {
        some: {
          id: Array.isArray(specialties)
            ? {
                in: specialties,
              }
            : specialties,
        },
      };
    }

    if (!!approach?.length) {
      if (!where.profile) {
        where.profile = {};
      }

      where.profile.approach = {
        some: {
          id: Array.isArray(approach)
            ? {
                in: approach,
              }
            : approach,
        },
      };
    }

    if (!!services?.length) {
      if (!where.profile) {
        where.profile = {};
      }

      where.profile.services = {
        hasSome: Array.isArray(services) ? services : [services],
      };
    }

    if (state || city) {
      if (!where.profile) {
        where.profile = {};
      }

      where.profile.address = {
        state,
        city,
      };
    }

    if (!!exacts?.length) {
      where.id = Array.isArray(exacts)
        ? {
            in: exacts,
          }
        : exacts;
    }

    if (!!removes?.length) {
      where.id = Array.isArray(removes)
        ? {
            notIn: removes,
          }
        : {
            not: removes,
          };
    }

    if (validated === false || !validated) {
      where.profile = {
        is: null,
      };
    }

    if (validated === true) {
      if (!where.profile) {
        where.profile = {
          isNot: null,
        };
      } else {
        where.profile = {
          ...where.profile,
        };
      }
    }

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
              services: true,
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
              service: item.profile.services,
            }
          : undefined,
      })),
      total,
    };
  },
  {
    response: SchemaResponse,
    query: SchemaQuery,
  }
);
