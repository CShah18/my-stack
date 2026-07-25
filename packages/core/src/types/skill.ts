import { SkillCategory, ResourceReference } from './common.js';

export interface SkillExample {
  title: string;
  description: string;
  code: string;
}

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  category: SkillCategory;
  tags: string[];
  instructions: string;
  examples: SkillExample[];
  references: ResourceReference[];
  metadata?: Record<string, unknown>;
}
