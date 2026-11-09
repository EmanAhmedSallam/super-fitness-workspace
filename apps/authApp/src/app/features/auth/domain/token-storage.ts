export abstract class TokenStorage {
  abstract save(token: string, remember: boolean): void;
  abstract get(): string | null;
  abstract has(): boolean;
  abstract clear(): void;
}
