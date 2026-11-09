import { TestBed } from '@angular/core/testing';
import { FieldIcon } from './field-icon';
import { FieldIconName } from '../../models/field-types';

describe('FieldIcon', () => {
  async function render(name: FieldIconName, size?: number) {
    const fixture = TestBed.createComponent(FieldIcon);
    fixture.componentRef.setInput('name', name);
    if (size !== undefined) fixture.componentRef.setInput('size', size);
    await fixture.whenStable();
    return fixture;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldIcon],
    }).compileComponents();
  });

  it('draws a path for every supported glyph', async () => {
    const names: FieldIconName[] = [
      'email',
      'lock',
      'user',
      'phone',
      'calendar',
      'ruler',
      'weight',
      'target',
      'activity',
      'gender',
      'eye',
      'eye-off',
      'chevron-down',
      'chevron-left',
      'chevron-right',
      'upload',
      'image',
      'close',
      'menu',
    ];

    for (const name of names) {
      const fixture = await render(name);
      const path: SVGPathElement = fixture.nativeElement.querySelector('path');
      expect(path.getAttribute('d')?.length, name).toBeGreaterThan(0);
    }
  });

  it('is hidden from assistive tech, since the label carries the meaning', async () => {
    const fixture = await render('email');
    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });

  it('sizes to the requested box', async () => {
    const fixture = await render('lock', 24);
    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('width')).toBe('24');
    expect(svg.getAttribute('height')).toBe('24');
  });

  it('renders the supplied refresh glyph with inherited color and its original proportions', async () => {
    const fixture = await render('refresh');
    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    const path: SVGPathElement = fixture.nativeElement.querySelector('path');
    expect(svg.getAttribute('width')).toBe('18');
    expect(svg.getAttribute('height')).toBe('21');
    expect(svg.getAttribute('viewBox')).toBe('0 0 18 21');
    expect(svg.getAttribute('stroke')).toBe('none');
    expect(path.getAttribute('fill')).toBe('currentColor');
    expect(path.getAttribute('d')).toMatch(/^M6\.70957 5\.9725C/);
    expect(path.getAttribute('d')).toMatch(/L8\.64682 18\.3085Z$/);
  });
});
