import { join, resolve } from 'node:path';
import {
  AgentDefinition,
  SkillDefinition,
  WorkflowDefinition,
  RuleDefinition,
  ExecutionContext,
  MyStackConfig,
  AgentLoader,
  SkillLoader,
  WorkflowLoader,
  RuleLoader,
  ConfigLoader,
  PluginLoader,
  PluginResolver,
  ResolvedPlugin,
  TemplateDefinition,
  TemplateLoader,
  TemplateEngine,
  SecretsProvider,
  EnvSecretsProvider,
  SecurityAuditEntry,
} from '@mystack/core';
import { AgentOrchestrator, OrchestratorOptions } from '@mystack/orchestrator';
import { WorkflowEngine } from '@mystack/workflow-engine';
import { FileStore, MemoryStore } from '@mystack/memory';
import { PromptEngine } from '@mystack/prompts';

export * from '@mystack/core';
export * from '@mystack/orchestrator';
export * from '@mystack/workflow-engine';
export * from '@mystack/memory';
export * from '@mystack/prompts';

export interface MyStackInitOptions {
  root: string;
  configPath?: string;
  orchestratorOptions?: OrchestratorOptions;
  memoryStore?: MemoryStore;
  secretsProvider?: SecretsProvider;
}

export class MyStack {
  private rootDir: string;
  private config: MyStackConfig;
  private orchestrator: AgentOrchestrator;
  private workflowEngine: WorkflowEngine;
  private memoryStore: MemoryStore;
  private promptEngine: PromptEngine;
  private secretsProvider: SecretsProvider;
  private templateEngine: TemplateEngine;
  private resolvedPlugins: ResolvedPlugin[] = [];
  private loadedTemplatesCache: TemplateDefinition[] = [];

  private agentLoader = new AgentLoader();
  private skillLoader = new SkillLoader();
  private workflowLoader = new WorkflowLoader();
  private ruleLoader = new RuleLoader();
  private pluginLoader = new PluginLoader();
  private pluginResolver = new PluginResolver();
  private templateLoader = new TemplateLoader();

  private constructor(
    rootDir: string,
    config: MyStackConfig,
    orchestrator: AgentOrchestrator,
    workflowEngine: WorkflowEngine,
    memoryStore: MemoryStore,
    secretsProvider?: SecretsProvider,
  ) {
    this.rootDir = rootDir;
    this.config = config;
    this.orchestrator = orchestrator;
    this.workflowEngine = workflowEngine;
    this.memoryStore = memoryStore;
    this.secretsProvider = secretsProvider ?? new EnvSecretsProvider();
    this.promptEngine = new PromptEngine();
    this.templateEngine = new TemplateEngine();
  }

  public static async init(options: MyStackInitOptions): Promise<MyStack> {
    const rootDir = resolve(options.root);
    const configPath = options.configPath ?? join(rootDir, 'mystack.config.yaml');

    const configLoader = new ConfigLoader();
    let config: MyStackConfig;
    try {
      config = await configLoader.load(configPath);
    } catch {
      // Default fallback config if file not present
      config = {
        name: 'mystack',
        version: '0.1.0',
        agents: ['./agents'],
        skills: ['./skills'],
        workflows: ['./workflows'],
        rules: ['./rules'],
        templates: ['./templates'],
        plugins: ['./plugins'],
        settings: {
          logLevel: 'info',
          outputDir: '.mystack',
          cacheEnabled: true,
        },
      };
    }

    const memoryStore =
      options.memoryStore ??
      new FileStore(join(rootDir, config.settings.outputDir, 'memory'));

    const orchestrator = new AgentOrchestrator(options.orchestratorOptions);
    const workflowEngine = new WorkflowEngine(orchestrator);

    const instance = new MyStack(
      rootDir,
      config,
      orchestrator,
      workflowEngine,
      memoryStore,
      options.secretsProvider,
    );
    await instance.loadPlugins();
    await instance.loadAllAssets();
    await instance.loadTemplates();
    return instance;
  }

  public async loadPlugins(): Promise<ResolvedPlugin[]> {
    const resolved: ResolvedPlugin[] = [];
    for (const relPath of this.config.plugins ?? ['./plugins']) {
      const fullPath = join(this.rootDir, relPath);
      try {
        const definitions = await this.pluginLoader.loadAll(fullPath);
        for (const def of definitions) {
          const pluginDir = join(fullPath, def.id);
          const res = this.pluginResolver.resolve(def, pluginDir);
          resolved.push(res);
        }
      } catch {
        // Path might not exist
      }
    }
    this.resolvedPlugins = resolved;
    return resolved;
  }

  public async loadAgents(): Promise<AgentDefinition[]> {
    const agentPaths = [
      ...this.config.agents.map((rel) => join(this.rootDir, rel)),
      ...this.resolvedPlugins.flatMap((p) => p.assetDirectories.agents),
    ];

    const agents: AgentDefinition[] = [];
    for (const fullPath of agentPaths) {
      try {
        const loaded = await this.agentLoader.loadAll(fullPath);
        agents.push(...loaded);
      } catch {
        // Path might not exist
      }
    }
    for (const agent of agents) {
      this.orchestrator.registerAgent(agent);
    }
    return agents;
  }

  public async loadSkills(): Promise<SkillDefinition[]> {
    const skillPaths = [
      ...this.config.skills.map((rel) => join(this.rootDir, rel)),
      ...this.resolvedPlugins.flatMap((p) => p.assetDirectories.skills),
    ];

    const skills: SkillDefinition[] = [];
    for (const fullPath of skillPaths) {
      try {
        const loaded = await this.skillLoader.loadAll(fullPath);
        skills.push(...loaded);
      } catch {
        // Path might not exist
      }
    }
    return skills;
  }

  public async loadWorkflows(): Promise<WorkflowDefinition[]> {
    const workflowPaths = [
      ...this.config.workflows.map((rel) => join(this.rootDir, rel)),
      ...this.resolvedPlugins.flatMap((p) => p.assetDirectories.workflows),
    ];

    const workflows: WorkflowDefinition[] = [];
    for (const fullPath of workflowPaths) {
      try {
        const loaded = await this.workflowLoader.loadAll(fullPath);
        workflows.push(...loaded);
      } catch {
        // Path might not exist
      }
    }
    return workflows;
  }

  public async loadRules(): Promise<RuleDefinition[]> {
    const rulePaths = [
      ...this.config.rules.map((rel) => join(this.rootDir, rel)),
      ...this.resolvedPlugins.flatMap((p) => p.assetDirectories.rules),
    ];

    const rules: RuleDefinition[] = [];
    for (const fullPath of rulePaths) {
      try {
        const loaded = await this.ruleLoader.loadAll(fullPath);
        rules.push(...loaded);
      } catch {
        // Path might not exist
      }
    }
    return rules;
  }

  public async loadAllAssets(): Promise<{
    agents: AgentDefinition[];
    skills: SkillDefinition[];
    workflows: WorkflowDefinition[];
    rules: RuleDefinition[];
  }> {
    const agents = await this.loadAgents();
    const skills = await this.loadSkills();
    const workflows = await this.loadWorkflows();
    const rules = await this.loadRules();
    return { agents, skills, workflows, rules };
  }

  public async runWorkflow(
    workflowId: string,
    variables?: Record<string, unknown>,
  ): Promise<ExecutionContext> {
    const workflows = await this.loadWorkflows();
    const workflow = workflows.find((w) => w.id === workflowId);
    if (!workflow) {
      throw new Error(`Workflow '${workflowId}' not found in registered workflows.`);
    }

    const context = await this.workflowEngine.execute(workflow, variables);
    await this.memoryStore.set(`execution_${context.executionId}`, context);
    return context;
  }

  public getExecution(executionId: string): ExecutionContext | undefined {
    return this.workflowEngine.getStatus(executionId);
  }

  public async pauseExecution(executionId: string): Promise<void> {
    await this.workflowEngine.pause(executionId);
  }

  public async resumeExecution(executionId: string): Promise<ExecutionContext> {
    return this.workflowEngine.resume(executionId);
  }

  public async cancelExecution(executionId: string): Promise<void> {
    await this.workflowEngine.cancel(executionId);
  }

  public getConfig(): MyStackConfig {
    return this.config;
  }

  public getPlugins(): ResolvedPlugin[] {
    return this.resolvedPlugins;
  }

  public getOrchestrator(): AgentOrchestrator {
    return this.orchestrator;
  }

  public getWorkflowEngine(): WorkflowEngine {
    return this.workflowEngine;
  }

  public getMemoryStore(): MemoryStore {
    return this.memoryStore;
  }

  public async loadTemplates(): Promise<TemplateDefinition[]> {
    const templatePaths = [
      ...this.config.templates.map((rel) => join(this.rootDir, rel)),
      ...this.resolvedPlugins.flatMap((p) => p.assetDirectories.templates),
    ];

    const templates: TemplateDefinition[] = [];
    for (const fullPath of templatePaths) {
      try {
        const loaded = await this.templateLoader.loadAll(fullPath);
        templates.push(...loaded);
      } catch {
        // Path might not exist
      }
    }
    this.loadedTemplatesCache = templates;
    return templates;
  }

  public listTemplates(): TemplateDefinition[] {
    return this.loadedTemplatesCache;
  }

  public getTemplateEngine(): TemplateEngine {
    return this.templateEngine;
  }

  public getPromptEngine(): PromptEngine {
    return this.promptEngine;
  }

  public getSecretsProvider(): SecretsProvider {
    return this.secretsProvider;
  }

  public getSecurityAudit(context: ExecutionContext): SecurityAuditEntry[] {
    const vars = context.variables as Record<string, unknown>;
    return (vars['_securityAudit'] as SecurityAuditEntry[]) ?? [];
  }
}
