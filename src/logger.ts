import pino from 'pino';
import config, { IConfig } from 'config';

const configs: IConfig = config.get('App.logger');

export default pino({
    enabled: configs.get('enabled'),
    level: configs.get('level')
});


