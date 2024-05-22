import Http from '@/service/http';
import { count } from './count';

export const routerAnalytics = new Http({
  prefix: '/analytics',
}).use(count);
