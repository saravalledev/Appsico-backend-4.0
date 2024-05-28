import Http from '@/service/http';
import { follow } from './follow';
import { unfollow } from './unfollow';
import { verify } from './verify';

export const social = new Http({
  prefix: '/:id/social',
})
  .use(verify)
  .use(follow)
  .use(unfollow);
