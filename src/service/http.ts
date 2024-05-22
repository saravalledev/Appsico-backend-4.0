import environment from '@/libraries/environment';
import cors from '@elysiajs/cors';
import Elysia from 'elysia';
import prisma from './prisma';

const Http = Elysia;

export const context = new Http({
  name: 'context',
})
  .use(cors())
  .decorate('environment', environment)
  .decorate('db', prisma);

export default Http;
