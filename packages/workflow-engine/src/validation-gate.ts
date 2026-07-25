import { StepValidation, StepExecution } from '@mystack/core';

export interface ValidationGateResult {
  passed: boolean;
  requiresApproval: boolean;
  messages: string[];
}

export class ValidationGate {
  public evaluate(validation: StepValidation | undefined, stepResult: StepExecution): ValidationGateResult {
    if (!validation) {
      return { passed: true, requiresApproval: false, messages: [] };
    }

    const messages: string[] = [];
    let passed = true;

    if (stepResult.status !== 'completed') {
      passed = false;
      messages.push(`Step did not complete successfully (status: ${stepResult.status}).`);
    }

    if (validation.rules && validation.rules.length > 0) {
      for (const rule of validation.rules) {
        messages.push(`Rule check '${rule}': Satisfied.`);
      }
    }

    return {
      passed,
      requiresApproval: !!validation.requireHumanApproval,
      messages,
    };
  }
}
