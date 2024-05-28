import Http, { context } from '@/service/http';
import { TypeServicesEnum } from '@prisma/client';
import { t } from 'elysia';

export const updated = new Http().use(context).patch(
  '/:id',
  async ({ body, params: { id }, db }) => {
    await db.$transaction(
      async (db) => {
        const user = await db.users.update({
          where: {
            id,
          },
          data: {
            email: body.email,
            phone: body.phone ? body.phone.padStart(13, '55') : undefined,
          },
          select: {
            type: true,
          },
        });

        if (!!body.profile) {
          const profile = body.profile;

          const profileId = await db.profiles.findFirst({
            where: {
              user: {
                id,
              },
            },
            select: {
              id: true,
            },
          });

          if (!profileId) {
            await db.profiles.create({
              data: {
                id,
                bio: profile.bio!,
                specialties: !!profile.specialties?.length
                  ? {
                      connect: profile.specialties.map((item) => ({
                        id: item,
                      })),
                    }
                  : undefined,
                approach: !!profile.approach?.length
                  ? {
                      connect: profile.approach.map((item) => ({
                        id: item,
                      })),
                    }
                  : undefined,
                services: profile.service
                  ? {
                      set: profile.service,
                    }
                  : undefined,
              },
            });
          } else {
            await db.profiles.update({
              where: {
                id: profileId.id,
              },
              data: {
                bio: profile.bio,
                specialties: !!profile.specialties?.length
                  ? {
                      set: profile.specialties?.map((item) => ({
                        id: item,
                      })),
                    }
                  : undefined,
                approach: !!profile.approach?.length
                  ? {
                      set: profile.approach?.map((item) => ({
                        id: item,
                      })),
                    }
                  : undefined,
                services: !!profile.service?.length
                  ? {
                      set: profile.service,
                    }
                  : undefined,
              },
            });
          }
        }

        if (!!body.address) {
          const address = body.address;

          const addressId = await db.address.findFirst({
            where:
              user.type === 'patient'
                ? {
                    userId: id,
                  }
                : {
                    profileId: id,
                  },
            select: {
              id: true,
            },
          });

          if (!addressId) {
            await db.address.create({
              data: {
                profileId: user.type === 'professional' ? id : undefined,
                userId: user.type === 'patient' ? id : undefined,
                displayName: address.display_name!,
                street: address.street!,
                number: address.number!,
                neighborhood: address.neighborhood!,
                city: address.city!,
                state: address.state!,
                stateCode: address.state_code!,
                country: address.country!,
                countryCode: address.country_code!,
                zipCode: address.zip_code!,
                longitude: address.longitude!,
                latitude: address.latitude!,
              },
            });
          } else {
            await db.address.update({
              where: {
                id: addressId.id,
              },
              data: {
                displayName: address.display_name,
                street: address.street,
                number: address.number,
                neighborhood: address.neighborhood,
                city: address.city,
                state: address.state,
                stateCode: address.state_code,
                country: address.country,
                countryCode: address.country_code,
                zipCode: address.zip_code,
                longitude: address.longitude,
                latitude: address.latitude,
              },
            });
          }
        }
      },
      {
        maxWait: 999999,
        timeout: 999999,
      }
    );

    return {
      message: 'Perfil alterado com sucesso',
    };
  },
  {
    type: 'application/json',
    response: t.Object({
      message: t.String(),
    }),
    params: t.Object({
      id: t.String(),
    }),
    body: t.Partial(
      t.Object({
        email: t.String(),
        phone: t.String(),
        profile: t.Partial(
          t.Object({
            bio: t.Optional(t.String()),
            specialties: t.Optional(t.Array(t.String())),
            approach: t.Optional(t.Array(t.String())),
            service: t.Optional(t.Array(t.Enum(TypeServicesEnum))),
          })
        ),
        address: t.Optional(
          t.Object({
            display_name: t.Optional(t.String()),
            street: t.Optional(t.String()),
            number: t.Optional(t.Number()),
            neighborhood: t.Optional(t.String()),
            city: t.Optional(t.String()),
            state: t.Optional(t.String()),
            state_code: t.Optional(t.String()),
            country: t.Optional(t.String()),
            country_code: t.Optional(t.String()),
            zip_code: t.Optional(t.String()),
            latitude: t.Optional(t.Number()),
            longitude: t.Optional(t.Number()),
          })
        ),
      })
    ),
  }
);
