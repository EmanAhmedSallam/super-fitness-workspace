import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateMultiHttpLoader } from '@ngx-translate/http-loader';

/**
 * Translation scopes: each app owns `public/assets/i18n/<scope>/{en,ar}.json`,
 * served at `/assets/i18n/<scope>/`.
 * - shell:   shared keys (app, form, ui)
 * - auth:    authApp keys (auth)
 * - fitness: superFitness keys (navbar, home, landing, footer, chat)
 */
export type I18nScope = 'shell' | 'auth' | 'fitness';

export function provideI18n(scopes: readonly I18nScope[]) {
  return provideTranslateService({
    // Every scope file is fetched and deep-merged into one dictionary per language
    loader: provideTranslateMultiHttpLoader({
      resources: scopes.map((scope) => ({
        prefix: `/assets/i18n/${scope}/`,
        suffix: '.json',
      })),
    }),
    fallbackLang: 'en',
    lang: 'en',
  });
}
