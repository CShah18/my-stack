import { MyStack } from './index.js';

async function runE2ETest() {
  console.log('🚀 Running MyStack Framework End-to-End Integration Test...\n');

  // 1. Initialize MyStack SDK with workspace root
  console.log('[1/6] Initializing MyStack SDK and discovering assets...');
  const mystack = await MyStack.init({ root: process.cwd() });
  const config = mystack.getConfig();
  console.log(`  ✔ Config loaded: ${config.name} v${config.version}`);

  // 2. Verify Plugins
  console.log('[2/6] Verifying Plugin System...');
  const plugins = mystack.getPlugins();
  console.log(`  ✔ Discovered ${plugins.length} plugin(s):`);
  for (const p of plugins) {
    console.log(`     - [${p.definition.id}] ${p.definition.name} v${p.definition.version}`);
  }
  if (plugins.length === 0) {
    throw new Error('E2E Test Failed: Expected at least 1 plugin (mystack-plugin-fullstack).');
  }

  // 3. Load & Merge Assets (Root + Plugin assets)
  console.log('[3/6] Loading & Merging Root and Plugin Assets...');
  const assets = await mystack.loadAllAssets();
  console.log(`  ✔ Loaded ${assets.agents.length} agents (includes plugin agent: fullstack-lead)`);
  console.log(`  ✔ Loaded ${assets.skills.length} skills (includes plugin skill: nextjs-app-router)`);
  console.log(`  ✔ Loaded ${assets.workflows.length} workflows (includes plugin workflow: fullstack-feature)`);
  console.log(`  ✔ Loaded ${assets.rules.length} rules`);

  const fullstackLead = assets.agents.find((a) => a.id === 'fullstack-lead');
  if (!fullstackLead) {
    throw new Error("E2E Test Failed: Plugin-provided agent 'fullstack-lead' not found!");
  }
  console.log('  ✔ Plugin agent registration confirmed.');

  // 4. Run Plugin-Provided Workflow
  console.log('[4/6] Executing Plugin-Provided Workflow (fullstack-feature)...');
  const engine = mystack.getWorkflowEngine();
  engine.on('step:start', ({ step }) => {
    console.log(`     ⚡ [Step: ${step.name}] Running agent '${step.agentId}'...`);
  });

  const execution = await mystack.runWorkflow('fullstack-feature', {
    featureName: 'E2E Test Feature Dashboard',
  });
  console.log(`  ✔ Workflow completed with status '${execution.status}' (Execution ID: ${execution.executionId})`);
  console.log(`  ✔ Executed ${execution.steps.length} steps successfully.`);

  // 5. Verify Memory Persistence
  console.log('[5/6] Verifying Memory Persistence...');
  const storedExecution = await mystack.getMemoryStore().get(`execution_${execution.executionId}`);
  if (!storedExecution) {
    throw new Error('E2E Test Failed: Execution state was not persisted to Memory Store.');
  }
  console.log('  ✔ Execution state successfully retrieved from Memory Store.');

  // 6. Verify Prompt Rendering Engine
  console.log('[6/6] Verifying Prompt Compiler...');
  const promptEngine = mystack.getPromptEngine();
  const compiledPrompt = promptEngine.render(
    fullstackLead.prompt,
    { featureDescription: 'E2E Test Fullstack Feature' },
  );
  if (!compiledPrompt.includes('E2E Test Fullstack Feature')) {
    throw new Error('E2E Test Failed: Prompt variable substitution failed.');
  }
  console.log('  ✔ Prompt compiled successfully.');

  console.log('\n🎉 ALL 6 E2E INTEGRATION CHECKS PASSED SUCCESSFULLY!');
}

runE2ETest().catch((err) => {
  console.error('\n❌ E2E INTEGRATION TEST FAILED:', err);
  process.exit(1);
});
