import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pc from 'picocolors';
import { MyStack, SecretMasker } from '@cshah-mystack/sdk';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

async function main() {
  console.log(pc.bold(pc.magenta('\n======================================================')));
  console.log(pc.bold(pc.cyan('⚡  MYSTACK AI OPERATING SYSTEM DEMO  ⚡')));
  console.log(pc.bold(pc.magenta('======================================================\n')));

  // 1. Initialize MyStack Workspace
  console.log(pc.bold(pc.yellow('1. Initializing MyStack Workspace...')));
  const mystack = await MyStack.init({
    root: resolve(__dirname),
  });

  const config = mystack.getConfig();
  console.log(pc.green(`✔ Workspace Loaded: ${pc.bold(config.name)} v${config.version}`));
  console.log(pc.gray(`  Log Level: ${config.settings.logLevel} | Output Dir: ${config.settings.outputDir}\n`));

  // 2. Discover Registered Assets
  console.log(pc.bold(pc.yellow('2. Discovering Workspace Assets...')));
  const { agents, skills, workflows, rules } = await mystack.loadAllAssets();

  console.log(pc.blue(`  Found ${agents.length} Registered Agent(s):`));
  for (const agent of agents) {
    console.log(`  • ${pc.bold(agent.name)} (${pc.cyan(agent.id)}) — ${agent.description}`);
  }

  console.log(pc.blue(`\n  Found ${workflows.length} Configured Workflow(s):`));
  for (const wf of workflows) {
    console.log(`  • ${pc.bold(wf.name)} (${pc.cyan(wf.id)}) — ${wf.steps.length} Step(s)`);
  }

  console.log(pc.blue(`\n  Found ${skills.length} Skill(s) & ${rules.length} Rule(s)`));
  console.log('');

  // 3. Test Prompt Compilation Engine
  console.log(pc.bold(pc.yellow('3. Testing Prompt Compilation Engine...')));
  const promptEngine = mystack.getPromptEngine();
  const templateSpec = {
    id: 'demo-prompt',
    system: 'You are an AI Operating System Orchestrator.',
    template: 'Execute task: {{task_name}} for user {{user_name}}',
    variables: [
      { name: 'task_name', description: 'Name of task' },
      { name: 'user_name', description: 'Target user' },
    ],
  };
  const variables = {
    task_name: 'Build Microservice Auth Endpoint',
    user_name: 'Chirag',
  };

  const renderedSystem = promptEngine.renderSystem(templateSpec, variables);
  const renderedUser = promptEngine.render(templateSpec, variables);

  console.log(pc.gray('  Compiled System Prompt:'), renderedSystem);
  console.log(pc.gray('  Compiled User Prompt:  '), renderedUser);
  console.log(pc.green('✔ Prompt Engine successfully interpolated variables!\n'));

  // 4. Test Secret Masking & Security Layer
  console.log(pc.bold(pc.yellow('4. Testing Security & Secret Masking...')));
  const rawLog = 'User connected with API key sk-proj-1234567890abcdef1234567890 and DB pass secret_pass_99';
  const maskedLog = SecretMasker.mask(rawLog, ['secret_pass_99']);
  console.log(pc.gray('  Raw Log:   '), rawLog);
  console.log(pc.green('  Masked Log:'), pc.bold(maskedLog));
  console.log(pc.green('✔ Secret Masker automatically redacted tokens and explicit keys!\n'));

  // 5. Execute Multi-Agent Workflow Pipeline
  console.log(pc.bold(pc.yellow('5. Executing Multi-Agent Feature Pipeline...')));
  const workflowEngine = mystack.getWorkflowEngine();

  workflowEngine.on('workflow:start', (payload) => {
    console.log(pc.cyan(`  ▶ Workflow Started: ID [${payload.workflow.id}] Execution ID [${payload.context.executionId}]`));
  });

  workflowEngine.on('step:start', (payload) => {
    console.log(pc.blue(`    ↳ Starting Step [${payload.step.id}] (${payload.step.name}) -> Agent: ${payload.step.agentId}`));
  });

  workflowEngine.on('step:complete', (payload) => {
    const lastStep = payload.context.steps[payload.context.steps.length - 1];
    console.log(pc.green(`    ✔ Completed Step [${payload.step.id}] (Duration: ${lastStep?.durationMs ?? 0}ms)`));
  });

  workflowEngine.on('workflow:complete', (payload) => {
    console.log(pc.bold(pc.green(`\n✔ Workflow Execution Completed! Status: ${payload.context.status.toUpperCase()}`)));
  });

  const executionContext = await mystack.runWorkflow('feature-pipeline');

  console.log(pc.bold(pc.magenta('\n======================================================')));
  console.log(pc.bold(pc.green(`🎉 DEMO COMPLETED SUCCESSFULLY! (${executionContext.steps.length} step(s) executed)`)));
  console.log(pc.bold(pc.magenta('======================================================\n')));
}

main().catch((err) => {
  console.error(pc.red('\n✖ Demo Execution Error:'), err);
  process.exit(1);
});
