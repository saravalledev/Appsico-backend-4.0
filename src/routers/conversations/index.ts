import Http from '@/service/http';
import { empty } from './empty';
import { messages } from './messages';
import { verify } from './verify';

export const routerConversations = new Http({
  prefix: '/conversations',
})
  .use(verify)
  .use(empty)
  .use(messages);
