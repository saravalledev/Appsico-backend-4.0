import Http from '@/service/http';

import { findById } from '../user/findById';
import { approach } from './approach';
import { findMany } from './findMany';
import { services } from './services';
import { social } from './social';
import { specialties } from './specialties';
import { states } from './states';

export const routerProfessionals = new Http({
  prefix: '/professionals',
})
  .use(findMany)
  .use(findById)
  .use(specialties)
  .use(approach)
  .use(services)
  .use(states)
  .use(social);
