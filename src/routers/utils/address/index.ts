import Http from '@/service/http';
import { t } from 'elysia';

type ResponseAddress = Array<{
  formattedAddress: string;
  addressComponents: Array<{
    longText: string;
    shortText: string;
    types: Array<
      | 'street_number'
      | 'route'
      | 'sublocality_level_1'
      | 'administrative_area_level_2'
      | 'administrative_area_level_1'
      | 'country'
      | 'postal_code'
    >;
    languageCode: string;
  }>;
  location: {
    latitude: number;
    longitude: number;
  };
}>;

export const address = new Http().get(
  '/address',
  async ({ query: { search } }) => {
    const response: ResponseAddress = (
      await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        body: JSON.stringify({
          textQuery: search,
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': 'AIzaSyD9a26MdAtKCusqj-_rQB3fomBYcNOw0Hg',
          'X-Goog-FieldMask':
            'places.displayName,places.formattedAddress,places.addressComponents,places.location',
        },
      }).then(async (response) => await response.json())
    ).places;

    return response.map((item) => ({
      display_name: item.formattedAddress.toLowerCase(),
      street:
        item.addressComponents
          .find((e) => e.types.includes('route'))
          ?.longText!.toLowerCase()! || item.formattedAddress.toLowerCase(),
      number:
        Number(
          item.addressComponents.find((e) => e.types.includes('street_number'))
            ?.longText!
        ) || undefined,
      neighborhood: item.addressComponents
        .find((e) => e.types.includes('sublocality_level_1'))
        ?.longText!.toLowerCase()!,
      city: item.addressComponents
        .find((e) => e.types.includes('administrative_area_level_2'))
        ?.longText!.toLowerCase()!,
      state: item.addressComponents
        .find((e) => e.types.includes('administrative_area_level_1'))
        ?.longText!.toLowerCase()!,
      state_code: item.addressComponents
        .find((e) => e.types.includes('administrative_area_level_1'))
        ?.shortText!.toLowerCase()!,
      country: item.addressComponents
        .find((e) => e.types.includes('country'))
        ?.longText!.toLowerCase()!,
      country_code: item.addressComponents
        .find((e) => e.types.includes('country'))
        ?.shortText!.toLowerCase()!,
      zip_code: item.addressComponents
        .find((e) => e.types.includes('postal_code'))
        ?.longText.replaceAll('-', '')!
        .toLowerCase()!,
      geo: {
        latitude: item.location.latitude,
        longitude: item.location.longitude,
      },
    }))[0];
  },
  {
    response: t.Object({
      display_name: t.String(),
      street: t.String(),
      number: t.Optional(t.Number()),
      neighborhood: t.String(),
      city: t.String(),
      state: t.String(),
      state_code: t.String(),
      country: t.String(),
      country_code: t.String(),
      zip_code: t.String(),
      geo: t.Object({
        latitude: t.Number(),
        longitude: t.Number(),
      }),
    }),
    query: t.Object({
      search: t.String(),
    }),
  }
);
