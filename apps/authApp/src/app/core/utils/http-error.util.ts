import { HttpErrorResponse } from '@angular/common/http';

/** i18n key — render it through the translate pipe/service. */
const GENERIC_ERROR_KEY = 'auth.errors.generic';

export function extractError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const payload = error.error as Record<string, unknown> | undefined;
    const apiError = typeof payload?.['error'] === 'string' ? payload['error'] : '';
    const apiMessage =
      typeof payload?.['message'] === 'string' ? payload['message'] : '';

    if (apiError.trim()) {
      return apiError;
    }

    if (apiMessage.trim()) {
      return apiMessage;
    }

    if (typeof error.message === 'string' && error.message.trim()) {
      return error.message;
    }

    return GENERIC_ERROR_KEY;
  }

  if (typeof error === 'object' && error !== null) {
    const payload = error as Record<string, unknown>;
    const apiError = typeof payload['error'] === 'string' ? payload['error'] : '';
    const apiMessage =
      typeof payload['message'] === 'string' ? payload['message'] : '';

    if (apiError.trim()) {
      return apiError;
    }

    if (apiMessage.trim()) {
      return apiMessage;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return GENERIC_ERROR_KEY;
}
