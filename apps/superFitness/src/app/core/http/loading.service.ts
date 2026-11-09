import { Injectable, Signal, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly pending = signal<Record<string, number>>({});

  isLoading(key: string): Signal<boolean> {
    return computed(() => (this.pending()[key] ?? 0) > 0);
  }

  start(key: string): void {
    this.pending.update((pending) => ({ ...pending, [key]: (pending[key] ?? 0) + 1 }));
  }

  stop(key: string): void {
    this.pending.update((pending) => ({ ...pending, [key]: Math.max((pending[key] ?? 1) - 1, 0) }));
  }
}
