import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthFeedback } from './auth-feedback';

describe('AuthFeedback', () => {
  let fixture: ComponentFixture<AuthFeedback>;

  async function render(errors: string[], notice: string | null = null) {
    fixture.componentRef.setInput('errors', errors);
    fixture.componentRef.setInput('notice', notice);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthFeedback],
    }).compileComponents();
    fixture = TestBed.createComponent(AuthFeedback);
  });

  it('renders nothing when there is nothing to say', async () => {
    const el = await render([]);
    expect(el.children.length).toBe(0);
  });

  it('lists each API error inside an alert', async () => {
    const el = await render(['"email" is required', '"age" is required']);

    expect(el.querySelector('[role=alert]')).toBeTruthy();
    expect(
      Array.from(el.querySelectorAll('li')).map((li) => li.textContent?.trim())
    ).toEqual(['"email" is required', '"age" is required']);
  });

  it('shows a neutral notice as a status message', async () => {
    const el = await render([], 'Social sign-in is not connected yet.');

    expect(el.querySelector('[role=status]')?.textContent?.trim()).toBe(
      'Social sign-in is not connected yet.'
    );
    expect(el.querySelector('[role=alert]')).toBeNull();
  });
});
