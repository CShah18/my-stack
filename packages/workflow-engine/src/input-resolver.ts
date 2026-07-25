import { StepInput, ExecutionContext } from '@mystack/core';

export class InputResolver {
  public resolve(inputSpec: StepInput, context: ExecutionContext): unknown {
    switch (inputSpec.source) {
      case 'variables': {
        if (inputSpec.key) {
          return context.variables[inputSpec.key];
        }
        return context.variables;
      }
      case 'previous_step': {
        const completedSteps = context.steps.filter((s) => s.status === 'completed');
        const lastStep = completedSteps[completedSteps.length - 1];
        if (!lastStep) {
          return context.variables;
        }
        if (inputSpec.key && typeof lastStep.output === 'object' && lastStep.output !== null) {
          return (lastStep.output as Record<string, unknown>)[inputSpec.key];
        }
        return lastStep.output;
      }
      case 'static': {
        return inputSpec.value ?? null;
      }
      default: {
        return context.variables;
      }
    }
  }
}
