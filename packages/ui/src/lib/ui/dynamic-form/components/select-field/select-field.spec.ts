import { TestBed } from '@angular/core/testing';
import { SelectField } from './select-field';
import { SelectFieldConfig } from '../../../../models/field-types';
import { fieldControl } from '../../../../../testing/field-control';

describe('SelectField', () => {
  const base: SelectFieldConfig = {
    key: 'gender',
    type: 'select',
    label: 'Gender',
    required: true,
    options: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
    ],
  };

  async function render(field: SelectFieldConfig = base) {
    const fixture = TestBed.createComponent(SelectField);
    fixture.componentRef.setInput('field', field);
    fixture.componentRef.setInput('control', fieldControl(''));
    await fixture.whenStable();
    return fixture;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectField],
    }).compileComponents();
  });

  it('should create', async () => {
    const fixture = await render();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the label and the select control', async () => {
    const fixture = await render();
    expect(
      fixture.nativeElement.querySelector('label').textContent?.trim()
    ).toBe('Gender *');
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    expect(select.id).toBe('gender');

    expect(Array.from(select.options).map((o) => o.value)).toEqual(['', 'male', 'female']);
  });

  it('falls back to a default placeholder when no i18n is provided', async () => {
    const fixture = await render();
    expect(fixture.nativeElement.textContent).toContain('Select');
  });

  it('prefers an explicit placeholder over the default', async () => {
    const fixture = await render({ ...base, placeholder: 'Pick a gender' });
    expect(fixture.nativeElement.textContent).toContain('Pick a gender');
  });
});
