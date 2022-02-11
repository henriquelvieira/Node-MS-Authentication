import pino from 'pino';

import Configs from './util/configs';

const configs = Configs.get('App.logger');

export default pino({
  enabled: configs.get('enabled'),
  level: configs.get('level'),
});
