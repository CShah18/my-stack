import { SkillDefinition } from '../types/skill.js';
import { SkillDefinitionSchema } from '../schemas/index.js';
import { YamlLoader } from './yaml-loader.js';

export class SkillLoader extends YamlLoader<SkillDefinition> {
  constructor() {
    super(SkillDefinitionSchema);
  }
}
