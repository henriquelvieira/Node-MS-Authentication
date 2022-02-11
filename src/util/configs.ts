import config, { IConfig } from 'config';

class Configs {
  get(configName: string): IConfig {
    const configs: IConfig = config.get(configName);
    return configs;
  }
}

export default new Configs();
