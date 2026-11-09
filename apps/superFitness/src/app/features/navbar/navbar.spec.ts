import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { FieldIcon } from '@org/ui';
import { AuthSessionService } from '@super-fitness/auth';
import { Navbar } from './navbar';

describe('Navbar', () => {
  beforeEach(async () => {
    localStorage.removeItem('super-fitness.theme');
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: AuthSessionService, useValue: { isAuthenticated: () => true } },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.removeItem('super-fitness.theme');
    document.documentElement.classList.remove('dark');
  });

  it('switches themes through the toggle beside the existing controls', async () => {
    const fixture = TestBed.createComponent(Navbar);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.actions lib-theme-toggle button',
    );
    const icon = fixture.debugElement.queryAll(By.directive(FieldIcon))[0]
      .componentInstance as FieldIcon;
    expect(icon.name()).toBe('sun');
    button.click();
    await fixture.whenStable();
    expect(icon.name()).toBe('moon');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('super-fitness.theme')).toBe('light');
    button.click();
    await fixture.whenStable();
    expect(icon.name()).toBe('sun');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('super-fitness.theme')).toBe('dark');
    expect(fixture.nativeElement.querySelector('.actions a.btn')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.menu-btn')).toBeTruthy();
  });

  it('shows the links', async () => {
    const fixture = TestBed.createComponent(Navbar);
    await fixture.whenStable();

    const links = fixture.nativeElement.querySelectorAll('.links a');
    expect(links.length).toBe(4);
  });

  it('shows language and theme controls with sign-in when the user is not authenticated', async () => {
    vi.spyOn(TestBed.inject(AuthSessionService), 'isAuthenticated').mockReturnValue(false);
    const fixture = TestBed.createComponent(Navbar);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.actions a.btn')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('.actions lib-site-button')).toHaveLength(2);
  });

  it('opens and closes the menu', async () => {
    const fixture = TestBed.createComponent(Navbar);
    const host: HTMLElement = fixture.nativeElement;
    await fixture.whenStable();

    host.querySelector<HTMLButtonElement>('.menu-btn')!.click();
    await fixture.whenStable();
    expect(host.querySelector('.drawer')).not.toBeNull();

    host.querySelector<HTMLButtonElement>('.backdrop')!.click();
    await fixture.whenStable();
    expect(host.querySelector('.drawer')).toBeNull();
  });
});
