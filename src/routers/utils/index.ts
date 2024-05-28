import Http from '@/service/http';
import { address } from './address';

export const routerUtils = new Http().use(address);
