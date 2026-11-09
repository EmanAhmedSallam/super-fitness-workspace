import { Injectable, Signal, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpErrorService {
  private readonly errors = signal<Record<string, string | null>>({});

  error(key: string): Signal<string | null> {
    return computed(() => this.errors()[key] ?? null);
  }

  set(key: string, message: string): void {
    this.errors.update((errors) => ({ ...errors, [key]: message }));
  }

  clear(key: string): void {
    if (this.errors()[key]) this.errors.update((errors) => ({ ...errors, [key]: null }));
  }
}
