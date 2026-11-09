import { TestBed } from '@angular/core/testing';
import { TextareaField } from './textarea-field';
import { TextareaFieldConfig } from '../../../../models/field-types';
import { fieldControl } from '../../../../../testing/field-control';

describe('TextareaField', () => {
  const base: TextareaFieldConfig = {
    key: 'bio',
    type: 'textarea',
    label: 'Bio',
    placeholder: 'Tell us about yourself',
  };

  async function render(field: TextareaFieldConfig = base) {
    const fixture = TestBed.createComponent(TextareaField);
    fixture.componentRef.setInput('field', field);
    fixture.componentRef.setInput('control', fieldControl(''));
    await fixture.whenStable();
    return fixture;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaField],
    }).compileComponents();
  });

  it('should create', async () => {
    expect((await render()).componentInstance).toBeTruthy();
  });

  it('defaults to four rows and honours an override', async () => {
    const byDefault = await render();
    expect(
      byDefault.nativeElement.querySelector('textarea').getAttribute('rows')
    ).toBe('4');

    const taller = await render({ ...base, rows: 8 });
    expect(
      taller.nativeElement.querySelector('textarea').getAttribute('rows')
    ).toBe('8');
  });
});
