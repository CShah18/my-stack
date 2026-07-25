import { EventEmitter } from 'node:events';
import { OrchestratorEventType, OrchestratorEventPayloads } from './types.js';

export class OrchestratorEventBus {
  private emitter = new EventEmitter();

  public on<K extends OrchestratorEventType>(
    event: K,
    listener: (payload: OrchestratorEventPayloads[K]) => void,
  ): void {
    this.emitter.on(event, listener);
  }

  public off<K extends OrchestratorEventType>(
    event: K,
    listener: (payload: OrchestratorEventPayloads[K]) => void,
  ): void {
    this.emitter.off(event, listener);
  }

  public emit<K extends OrchestratorEventType>(
    event: K,
    payload: OrchestratorEventPayloads[K],
  ): void {
    this.emitter.emit(event, payload);
  }
}
