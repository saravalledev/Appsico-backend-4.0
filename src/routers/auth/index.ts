import Http from '@/service/http';
import { forgot } from './forgot';
import { login } from './login';
import { register } from './register';

export const routerAuth = new Http({
  prefix: '/auth',
})
  .use(login)
  .use(register)
  .use(forgot);
