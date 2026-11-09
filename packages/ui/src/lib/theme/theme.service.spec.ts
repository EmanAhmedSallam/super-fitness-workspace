import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
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

  it('defaults to dark and preserves unrelated root classes', () => {
    document.documentElement.classList.add('existing');
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('existing')).toBe(true);
    document.documentElement.classList.remove('existing');
  });

  it('switches the signal, root class and persisted preference together', () => {
    const service = TestBed.inject(ThemeService);
    service.setTheme('light');
    expect(service.theme()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('super-fitness.theme')).toBe('light');
    service.toggleTheme();
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('super-fitness.theme')).toBe('dark');
    service.toggleTheme();
    expect(service.theme()).toBe('light');
  });

  it.each(['light', 'dark'] as const)(
    'restores %s after a new application instance',
    (theme) => {
      TestBed.inject(ThemeService).setTheme(theme);
      TestBed.resetTestingModule();
      expect(TestBed.inject(ThemeService).theme()).toBe(theme);
      expect(document.documentElement.classList.contains('dark')).toBe(
        theme === 'dark',
      );
    },
  );

  it.each(['system', '', 'LIGHT'])(
    'falls back to dark for invalid preference %j',
    (value) => {
      localStorage.setItem('super-fitness.theme', value);
      expect(TestBed.inject(ThemeService).theme()).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    },
  );

  it('works when access to localStorage is blocked', () => {
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new Error('Storage blocked');
    });
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('dark');
    expect(() => service.toggleTheme()).not.toThrow();
    expect(service.theme()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('keeps switching when storage writes fail', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage full');
    });
    const service = TestBed.inject(ThemeService);
    expect(() => service.setTheme('light')).not.toThrow();
    expect(service.theme()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
