import { TestBed } from '@angular/core/testing';
import { CheckboxField } from './checkbox-field';
import { CheckboxFieldConfig } from '../../../../models/field-types';
import { fieldControl } from '../../../../../testing/field-control';

describe('CheckboxField', () => {
  const field: CheckboxFieldConfig = {
    key: 'subscribe',
    type: 'checkbox',
    label: 'Subscribe to the newsletter',
  };

  async function render() {
    const fixture = TestBed.createComponent(CheckboxField);
    fixture.componentRef.setInput('field', field);
    fixture.componentRef.setInput('control', fieldControl(false));
    await fixture.whenStable();
    return fixture;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxField],
    }).compileComponents();
  });

  it('should create', async () => {
    expect((await render()).componentInstance).toBeTruthy();
  });

  it('labels the checkbox and ties it to the control id', async () => {
    const fixture = await render();
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');

    expect(label.textContent?.trim()).toBe('Subscribe to the newsletter');
    expect(label.getAttribute('for')).toBe('subscribe');
  });
});
