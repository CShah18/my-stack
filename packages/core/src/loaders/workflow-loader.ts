import { WorkflowDefinition } from '../types/workflow.js';
import { WorkflowDefinitionSchema } from '../schemas/index.js';
import { YamlLoader } from './yaml-loader.js';

export class WorkflowLoader extends YamlLoader<WorkflowDefinition> {
  constructor() {
    super(WorkflowDefinitionSchema);
  }
}
