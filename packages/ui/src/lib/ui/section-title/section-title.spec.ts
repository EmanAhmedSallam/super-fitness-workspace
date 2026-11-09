import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionTitle } from './section-title';

@Component({
  selector: 'lib-test-icon',
  template: `<svg class="test-icon"></svg>`,
})
class TestIcon {}

describe('SectionTitle', () => {
  let fixture: ComponentFixture<SectionTitle>;

  async function render(inputs: Partial<Record<keyof SectionTitle, unknown>>) {
    fixture = TestBed.createComponent(SectionTitle);
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionTitle],
    }).compileComponents();
  });

  it('renders the primary text as the heading', async () => {
    const el = await render({ primaryText: 'Workouts' });

    expect(el.querySelector('h2')?.textContent?.trim()).toBe('Workouts');
  });

  it('applies custom pixel font sizes to the primary and secondary text', async () => {
    const el = await render({
      primaryText: 'Workouts',
      secondaryText: 'About Us',
      primaryTextFontSize: 96,
      secondaryTextFontSize: 24,
    });

    expect((el.querySelector('h2') as HTMLElement).style.fontSize).toBe('96px');
    expect((el.querySelector('p') as HTMLElement).style.fontSize).toBe('24px');
  });

  it('keeps the component background transparent', async () => {
    const el = await render({ primaryText: 'Workouts' });

    expect(el.className).toContain('[--st-bg:transparent]');
    expect(el.className).not.toContain('bg-(--st-bg)');
  });

  it('shows the dumbbell icon by default', async () => {
    const el = await render({ primaryText: 'Workouts' });

    expect(el.querySelector('lib-dumbbell-icon svg')).not.toBeNull();
  });

  it('renders the icon component passed by the parent instead', async () => {
    const el = await render({ primaryText: 'Workouts', icon: TestIcon });

    expect(el.querySelector('.test-icon')).not.toBeNull();
    expect(el.querySelector('lib-dumbbell-icon')).toBeNull();
  });

  it('renders SVG markup passed by the parent', async () => {
    const el = await render({
      primaryText: 'Workouts',
      iconSvg: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle></svg>',
    });

    expect(el.querySelector('svg circle')).not.toBeNull();
    expect(el.querySelector('lib-dumbbell-icon')).toBeNull();
  });

  it('hides the icon when showIcon is false', async () => {
    const el = await render({ primaryText: 'Workouts', showIcon: false });

    expect(el.querySelector('lib-dumbbell-icon')).toBeNull();
    expect(el.querySelector('span[aria-hidden]')).toBeNull();
  });

  it('only renders the secondary text when it is given', async () => {
    const bare = await render({ primaryText: 'Workouts' });
    expect(bare.querySelector('p')).toBeNull();

    const full = await render({ primaryText: 'Workouts', secondaryText: 'About Us' });
    expect(full.querySelector('p')?.textContent?.trim()).toBe('About Us');
  });

  it('keeps its base classes when the size changes', async () => {
    const el = await render({ primaryText: 'Workouts', size: 'lg' });
    const stack = el.querySelector('div') as HTMLElement;

    expect(stack.className).toContain('14rem');
    expect(stack.classList.contains('grid')).toBe(true);
  });

  it('aligns the label to the start by default and to the centre on request', async () => {
    const start = await render({ primaryText: 'Workouts', secondaryText: 'About Us' });
    const startTag = start.querySelector('p')?.parentElement as HTMLElement;
    expect(startTag.classList.contains('justify-self-start')).toBe(true);
    expect(startTag.classList.contains('self-end')).toBe(true);

    const center = await render({
      primaryText: 'Workouts',
      secondaryText: 'About Us',
      labelAlign: 'center',
    });
    const centerTag = center.querySelector('p')?.parentElement as HTMLElement;
    expect(centerTag.classList.contains('justify-self-center')).toBe(true);
    expect(centerTag.classList.contains('justify-self-start')).toBe(false);
  });

  it('applies custom padding and margin to the host', async () => {
    const el = await render({
      primaryText: 'Workouts',
      padding: '3rem 1rem',
      margin: '2rem 0',
    });

    expect(el.style.padding).toBe('3rem 1rem');
    expect(el.style.margin).toBe('2rem 0px');
  });
});
