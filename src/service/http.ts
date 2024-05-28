import environment from '@/libraries/environment';
import cors from '@elysiajs/cors';
import Elysia from 'elysia';
import prisma from './prisma';

import querystring from 'node:querystring';

function convertQueryParams(query: any) {
  const parsedQuery = {};

  for (const key in query) {
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      const value = query[key];

      if (Array.isArray(value)) {
        //@ts-expect-error
        parsedQuery[key] = value.map(convertValue);
      } else {
        //@ts-expect-error
        parsedQuery[key] = convertValue(value);
      }
    }
  }

  return parsedQuery;
}

function convertValue(value: any) {
  if (value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    //@ts-expect-error
    if (!isNaN(value)) {
      return Number(value);
    }
    if (value.toLowerCase() === 'true') {
      return true;
    }
    if (value.toLowerCase() === 'false') {
      return false;
    }
  }
  return value;
}

export const context = (app: Elysia) =>
  app
    .use(cors())
    .decorate('environment', environment)
    .decorate('db', prisma)
    .derive(({ headers }) => {
      const auth = headers['Authorization'];

      return {
        authorization: auth?.startsWith('Bearer ') ? auth.slice(7) : null,
      };
    })
    .onTransform((ctx) => {
      const rawQuery = querystring.parse(
        new URL(ctx.request.url).search.slice(1)
      );

      ctx.query = convertQueryParams(rawQuery);
    });

const Http = Elysia;
export default Http;
