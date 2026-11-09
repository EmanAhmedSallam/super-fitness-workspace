import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthHeader } from './auth-header';

describe('AuthHeader', () => {
  let fixture: ComponentFixture<AuthHeader>;

  async function render(inputs: Partial<Record<keyof AuthHeader, unknown>>) {
    fixture = TestBed.createComponent(AuthHeader);
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthHeader],
    }).compileComponents();
  });

  it('renders the title as the page h1 by default', async () => {
    const el = await render({ title: 'Create An Account' });

    expect(el.querySelector('h1')?.textContent?.trim()).toBe('Create An Account');
    expect(el.querySelector('h2')).toBeNull();
  });

  it('can drop to an h2 when it sits under another heading', async () => {
    const el = await render({ title: 'Reset Your Password', headingLevel: 2 });

    expect(el.querySelector('h2')?.textContent?.trim()).toBe('Reset Your Password');
    expect(el.querySelector('h1')).toBeNull();
  });

  it('only renders the eyebrow and subtitle when they are given', async () => {
    const bare = await render({ title: 'Welcome Back' });
    expect(bare.querySelector('.auth-header__eyebrow')).toBeNull();
    expect(bare.querySelector('.auth-header__subtitle')).toBeNull();

    const full = await render({
      title: 'Forgot Password?',
      eyebrow: 'Hey There',
      subtitle: 'Enter your email to get a reset code.',
    });
    expect(full.querySelector('.auth-header__eyebrow')?.textContent?.trim()).toBe(
      'Hey There'
    );
    expect(full.querySelector('.auth-header__subtitle')?.textContent?.trim()).toBe(
      'Enter your email to get a reset code.'
    );
  });

  it('switches to start alignment through a host class', async () => {
    await render({ title: 'Welcome Back', align: 'start' });
    expect(fixture.nativeElement.classList.contains('auth-header--start')).toBe(true);

    fixture.componentRef.setInput('align', 'center');
    await fixture.whenStable();
    expect(fixture.nativeElement.classList.contains('auth-header--start')).toBe(false);
  });

  it('projects media above the text and extra content below it', async () => {
    @Component({
      imports: [AuthHeader],
      template: `
        <lib-auth-header title="Verify Your Email">
          <span authHeaderMedia class="media">icon</span>
          <a class="extra">Resend code</a>
        </lib-auth-header>
      `,
    })
    class Host {}

    const host = TestBed.createComponent(Host);
    await host.whenStable();

    const header: HTMLElement = host.nativeElement.querySelector('lib-auth-header');
    const children = Array.from(header.children).map((c) => c.className);

    expect(children[0]).toBe('media');
    expect(children.at(-1)).toBe('extra');
  });
});
