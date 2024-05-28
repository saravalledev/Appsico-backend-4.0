import Http from '@/service/http';

import { updated } from './update';

export const password = new Http({
  prefix: '/password',
}).use(updated);
