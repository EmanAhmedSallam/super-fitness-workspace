import { InjectionToken } from '@angular/core';
import { SECRETS } from '@super-fitness/data-access-user';

export const GEMINI_API_KEY = new InjectionToken<string>('GEMINI_API_KEY', {
  providedIn: 'root',
  factory: () => SECRETS.geminiApiKey,
});
