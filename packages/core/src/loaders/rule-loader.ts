import { RuleDefinition } from '../types/rule.js';
import { RuleDefinitionSchema } from '../schemas/index.js';
import { YamlLoader } from './yaml-loader.js';

export class RuleLoader extends YamlLoader<RuleDefinition> {
  constructor() {
    super(RuleDefinitionSchema);
  }
}
