import Http, { context } from './service/http';

import { routers } from './routers';
import { websocket } from './routers/websocket';

import environment from './libraries/environment';

new Http({
  name: 'main',
})
  .use(context)
  .use(routers)
  .use(websocket)
  .listen(environment.port);
