import { MyStack } from './index.js';

async function main() {
  console.log('🧪 Starting MyStack Phase 2 Integration Smoke Test...');

  // Initialize MyStack from root directory
  const mystack = await MyStack.init({ root: '.' });

  console.log('1. Testing asset loading from YAML files...');
  const agents = await mystack.loadAgents();
  console.log(`   - Loaded ${agents.length} agents (expected 15)`);

  const skills = await mystack.loadSkills();
  console.log(`   - Loaded ${skills.length} skills (expected 16)`);

  const workflows = await mystack.loadWorkflows();
  console.log(`   - Loaded ${workflows.length} workflows (expected 5)`);

  const rules = await mystack.loadRules();
  console.log(`   - Loaded ${rules.length} rules (expected 8)`);

  if (agents.length !== 15 || skills.length !== 16 || workflows.length !== 5 || rules.length !== 8) {
    throw new Error('Asset count mismatch!');
  }

  console.log('2. Testing workflow execution...');
  // Run the 'review' workflow (3 steps: QA, Security, Performance)
  const result = await mystack.runWorkflow('review', {
    targetPath: 'src/',
  });

  console.log(`   - Workflow status: ${result.status}`);
  console.log(`   - Executed steps: ${result.steps.length}`);
  console.log(`   - Execution logs: ${result.logs.length}`);

  if (result.status !== 'completed' || result.steps.length !== 3) {
    throw new Error(`Workflow execution failed or incomplete! Status: ${result.status}`);
  }

  console.log('3. Testing memory persistence...');
  const storedExecution = await mystack.getMemoryStore().get(`execution_${result.executionId}`);
  if (!storedExecution) {
    throw new Error('Failed to retrieve execution context from memory store!');
  }
  console.log('   - Memory persistence verified successfully.');

  console.log('4. Testing PromptEngine compilation...');
  const promptEngine = mystack.getPromptEngine();
  const compiled = promptEngine.render(
    {
      id: 'test',
      system: 'System prompt',
      template: 'Hello {{#if show}}{{name}}{{/if}}',
      variables: [],
    },
    { show: true, name: 'MyStack' },
  );
  console.log(`   - Prompt render result: "${compiled}"`);
  if (compiled !== 'Hello MyStack') {
    throw new Error(`Prompt rendering failed: ${compiled}`);
  }

  console.log('✅ ALL PHASE 2 SMOKE TESTS PASSED SUCCESSFULLY!');
}

main().catch((err) => {
  console.error('❌ Smoke test failed:', err);
  process.exit(1);
});
