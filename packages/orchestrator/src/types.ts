import { AgentDefinition, StepExecution, ExecutionContext } from '@mystack/core';

export type AgentHandler = (
  agent: AgentDefinition,
  input: unknown,
  context: ExecutionContext,
) => Promise<unknown>;

export type MiddlewareNext = () => Promise<StepExecution>;

export type Middleware = (
  agent: AgentDefinition,
  input: unknown,
  context: ExecutionContext,
  next: MiddlewareNext,
) => Promise<StepExecution>;

export type OrchestratorEventType =
  | 'agent:registered'
  | 'dispatch:start'
  | 'dispatch:complete'
  | 'dispatch:error';

export interface OrchestratorEventPayloads {
  'agent:registered': { agent: AgentDefinition };
  'dispatch:start': { agent: AgentDefinition; input: unknown; context: ExecutionContext };
  'dispatch:complete': { agent: AgentDefinition; result: StepExecution; context: ExecutionContext };
  'dispatch:error': { agent: AgentDefinition; error: Error; context: ExecutionContext };
}
