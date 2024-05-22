import Http from '@/service/http';
import { verify } from './verify';

export const routerConversations = new Http({
  prefix: '/conversations',
}).use(verify);
