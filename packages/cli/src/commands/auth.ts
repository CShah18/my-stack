import { logger } from '../utils/logger.js';
import { MyStack, SecretMasker } from '@cshah-mystack/sdk';

export async function authSetKeyCommand(key: string, value: string): Promise<void> {
  logger.banner('MyStack Auth Manager', `Configuring secret key: ${key.toUpperCase()}`);

  try {
    const mystack = await MyStack.init({ root: process.cwd() });
    const provider = mystack.getSecretsProvider();
    await provider.set(key, value);
    logger.success(`Configured secret 'MYSTACK_SECRET_${key.toUpperCase()}' in process environment.`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(msg);
    process.exit(1);
  }
}

export async function authListKeysCommand(): Promise<void> {
  logger.banner('MyStack Auth Manager', 'Configured Secrets Overview');

  try {
    const mystack = await MyStack.init({ root: process.cwd() });
    const provider = mystack.getSecretsProvider();
    const keys = await provider.list();

    const standardKeys = ['OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'GEMINI_API_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
    const rows: string[][] = [];

    for (const key of standardKeys) {
      const exists = await provider.has(key);
      const val = exists ? await provider.get(key) : undefined;
      const masked = val ? SecretMasker.mask(val) : 'Not Configured';
      rows.push([key, exists ? '✔ Active' : '✖ Missing', masked]);
    }

    for (const key of keys) {
      if (!standardKeys.includes(key.toUpperCase())) {
        const val = await provider.get(key);
        const masked = val ? SecretMasker.mask(val) : 'Not Configured';
        rows.push([`MYSTACK_SECRET_${key.toUpperCase()}`, '✔ Active', masked]);
      }
    }

    logger.table(['Secret Key Name', 'Status', 'Masked Value'], rows);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(msg);
    process.exit(1);
  }
}

export async function authCheckCommand(): Promise<void> {
  logger.banner('MyStack Auth Health Check', 'Validating environment keys & permissions');

  try {
    const mystack = await MyStack.init({ root: process.cwd() });
    const provider = mystack.getSecretsProvider();

    const knownKeys = [
      { name: 'OPENAI_API_KEY', provider: 'OpenAI LLM Integration' },
      { name: 'ANTHROPIC_API_KEY', provider: 'Anthropic Claude Integration' },
      { name: 'GEMINI_API_KEY', provider: 'Google Gemini Integration' },
    ];

    let foundAny = false;
    for (const k of knownKeys) {
      const hasKey = await provider.has(k.name);
      if (hasKey) {
        logger.success(`[Configured] ${k.name} (${k.provider})`);
        foundAny = true;
      } else {
        logger.warn(`[Optional] ${k.name} not set (${k.provider})`);
      }
    }

    if (!foundAny) {
      logger.info('\nNo LLM API keys set in environment. Set keys using `mystack auth set-key <NAME> <VALUE>` or environment variables.');
    } else {
      logger.success('\nAuth environment verification completed successfully.');
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(msg);
    process.exit(1);
  }
}
