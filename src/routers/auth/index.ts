import Http from '@/service/http';
import { forgot } from './forgot';
import { login } from './login';
import { password } from './password';
import { profile } from './profile';
import { register } from './register';

export const routerAuth = new Http({
  prefix: '/auth',
})
  .use(login)
  .use(register)
  .use(forgot)
  .use(profile)
  .use(password);
