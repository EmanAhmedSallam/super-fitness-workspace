import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

const workspaceRoot = resolve(import.meta.dirname, '../../../../..');

describe.each(['shell', 'authApp', 'superFitness'])(
  '%s early theme initialization',
  (app) => {
    const html = readFileSync(
      resolve(workspaceRoot, `apps/${app}/src/index.html`),
      'utf8',
    );
    const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];

    beforeEach(() => {
      TestBed.resetTestingModule();
      localStorage.clear();
      document.documentElement.classList.remove('dark');
    });

    afterEach(() => {
      vi.restoreAllMocks();
      localStorage.clear();
      document.documentElement.classList.remove('dark');
    });

    it.each([null, 'light', 'dark', 'invalid'])(
      'agrees with the service for stored preference %j',
      (theme) => {
        if (theme !== null) localStorage.setItem('super-fitness.theme', theme);
        expect(script).toBeTruthy();
        expect(html.indexOf('<script>')).toBeLessThan(html.indexOf('</head>'));
        new Function('document', 'localStorage', script ?? '')(
          document,
          localStorage,
        );
        const dark = theme !== 'light';
        expect(document.documentElement.classList.contains('dark')).toBe(dark);
        expect(TestBed.inject(ThemeService).theme()).toBe(
          dark ? 'dark' : 'light',
        );
      },
    );

    it('defaults to dark when storage is unavailable before bootstrap', () => {
      const storage = {
        getItem: () => {
          throw new Error('Storage blocked');
        },
      };
      expect(() =>
        new Function('document', 'localStorage', script ?? '')(
          document,
          storage,
        ),
      ).not.toThrow();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('generates existing dark utilities that match only the selected document theme', () => {
      const file = resolve(workspaceRoot, `apps/${app}/src/styles.css`);
      const selector = execFileSync(
        process.execPath,
        [
          '--input-type=module',
          '-e',
          `import postcss from 'postcss';
         import tailwind from '@tailwindcss/postcss';
         import { readFileSync } from 'node:fs';
         const file = process.argv[1];
         const result = await postcss([tailwind()]).process(readFileSync(file, 'utf8'), { from: file });
         result.root.walkRules(rule => {
           if (rule.selector.startsWith('.dark') && rule.selector.includes('text-white')) {
             process.stdout.write(rule.selector);
           }
         });`,
          file,
        ],
        { cwd: workspaceRoot, encoding: 'utf8' },
      );
      expect(selector).toContain(':where(.dark, .dark *)');
      const heading = document.createElement('h2');
      heading.className = 'text-gray-900 dark:text-white';
      document.body.appendChild(heading);
      try {
        const service = TestBed.inject(ThemeService);
        expect(heading.matches(selector)).toBe(true);
        service.setTheme('light');
        expect(heading.matches(selector)).toBe(false);
        service.setTheme('dark');
        expect(heading.matches(selector)).toBe(true);
      } finally {
        heading.remove();
      }
    });
  },
);
