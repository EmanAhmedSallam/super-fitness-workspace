import { provideTranslateService } from '@ngx-translate/core';
import { TestBed } from '@angular/core/testing';
import { UploadField } from './upload-field';
import { UploadFieldConfig } from '../../../../models/field-types';
import { fieldControl } from '../../../../../testing/field-control';

describe('UploadField', () => {
  const field: UploadFieldConfig = {
    key: 'photo',
    type: 'upload',
    label: 'Photo',
    accept: 'image/*',
  };

  async function render(initial: string | string[] | null = null) {
    const fixture = TestBed.createComponent(UploadField);
    fixture.componentRef.setInput('field', field);
    fixture.componentRef.setInput('control', fieldControl(initial));
    await fixture.whenStable();
    return fixture;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadField],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  it('should create', async () => {
    expect((await render()).componentInstance).toBeTruthy();
  });

  it('offers the upload control while no image is stored', async () => {
    const fixture = await render();
    expect(fixture.componentInstance.hasExistingImages()).toBe(false);
    expect(fixture.nativeElement.querySelector('input[type=file]')).toBeTruthy();
  });

  it('reads already-stored URLs off the control', async () => {
    const fixture = await render('https://cdn.example.com/a.png');
    expect(fixture.componentInstance.currentUrls()).toEqual([
      'https://cdn.example.com/a.png',
    ]);
    expect(fixture.componentInstance.hasExistingImages()).toBe(true);
  });
});
