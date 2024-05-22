import Http, { context } from '@/service/http';
import { TypeServicesEnum } from '@prisma/client';
import { t } from 'elysia';

export const services = new Http().use(context).get(
  '/services',
  () => {
    return Object.keys(TypeServicesEnum);
  },
  {
    response: t.Array(t.String()),
  }
);
