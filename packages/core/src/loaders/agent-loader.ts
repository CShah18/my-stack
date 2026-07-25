import { AgentDefinition } from '../types/agent.js';
import { AgentDefinitionSchema } from '../schemas/index.js';
import { YamlLoader } from './yaml-loader.js';

export class AgentLoader extends YamlLoader<AgentDefinition> {
  constructor() {
    super(AgentDefinitionSchema);
  }
}
