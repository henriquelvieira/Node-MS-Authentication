import config, { IConfig } from 'config';
import pino from 'pino';

const configs: IConfig = config.get('App.logger');

export default pino({
  enabled: configs.get('enabled'),
  level: configs.get('level'),
});
