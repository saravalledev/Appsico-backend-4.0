import Http from '@/service/http';
import { updated } from './updated';

export const profile = new Http({
  prefix: '/profile',
}).use(updated);
