import { MyStackConfig } from '../types/config.js';
import { MyStackConfigSchema } from '../schemas/index.js';
import { YamlLoader } from './yaml-loader.js';

export class ConfigLoader extends YamlLoader<MyStackConfig> {
  constructor() {
    super(MyStackConfigSchema);
  }
}
