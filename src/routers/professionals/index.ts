import Http from '@/service/http';
import { approach } from './approach';
import { findMany } from './findMany';
import { services } from './services';
import { specialties } from './specialties';
import { states } from './states';

export const routerProfessionals = new Http({
  prefix: '/professionals',
})
  .use(findMany)
  .use(specialties)
  .use(approach)
  .use(services)
  .use(states);
