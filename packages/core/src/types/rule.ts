import { RuleCategory } from './common.js';

export interface RuleExample {
  description: string;
  good: string;
  bad: string;
}

export interface RuleDefinition {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  category: RuleCategory;
  enforcement: 'always' | 'suggest' | 'project-specific';
  instruction: string;
  examples: RuleExample[];
  metadata?: Record<string, unknown>;
}
