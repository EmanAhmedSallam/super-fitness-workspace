import { HttpContext, HttpContextToken } from '@angular/common/http';

export interface RequestState {
  key: string;
  errorMessage?: string;
}

export const REQUEST_STATE = new HttpContextToken<RequestState | null>(() => null);

export const withRequestState = (
  key: string,
  errorMessage?: string,
  context = new HttpContext(),
): HttpContext => context.set(REQUEST_STATE, { key, errorMessage });
