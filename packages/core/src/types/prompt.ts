export interface PromptVariable {
  name: string;
  description: string;
  required?: boolean;
  defaultValue?: string;
}

export interface PromptTemplate {
  id: string;
  system: string;
  template: string;
  variables: PromptVariable[];
  outputFormat?: 'markdown' | 'json' | 'yaml' | 'text';
  maxTokens?: number;
  temperature?: number;
}
