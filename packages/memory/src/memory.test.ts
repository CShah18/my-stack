import { describe, it, expect } from 'vitest';
import { InMemoryStore } from './index.js';

describe('InMemoryStore', () => {
  it('should store, retrieve, and delete values', async () => {
    const store = new InMemoryStore();
    await store.set('key1', { foo: 'bar' });

    const value = await store.get<{ foo: string }>('key1');
    expect(value).toEqual({ foo: 'bar' });

    await store.delete('key1');
    expect(await store.get('key1')).toBeUndefined();
  });

  it('should filter keys by prefix', async () => {
    const store = new InMemoryStore();
    await store.set('agent:a', 1);
    await store.set('agent:b', 2);
    await store.set('workflow:c', 3);

    const keys = await store.list('agent:');
    expect(keys).toEqual(['agent:a', 'agent:b']);
  });

  it('should respect TTL expiration', async () => {
    const store = new InMemoryStore();
    await store.set('temp', 'value', -100); // Expiry in past

    expect(await store.get('temp')).toBeUndefined();
  });
});
