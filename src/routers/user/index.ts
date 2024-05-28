import Http from '@/service/http';

import { findById } from '../user/findById';

export const routerUsers = new Http({
  prefix: '/users',
}).use(findById);
