import Http from '@/service/http';
import { conversations } from './conversations';
import { patients } from './patients';
import { professionals } from './professionals';
import { users } from './users';

export const count = new Http({
  prefix: '/count',
})
  .use(users)
  .use(conversations)
  .use(professionals)
  .use(patients);
