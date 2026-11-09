import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { RegistrationFlowService } from '../../services/registration-flow.service';
import { RegisterGenderPage } from './register-gender.page';

describe('RegisterGenderPage', () => {
  let fixture: ComponentFixture<RegisterGenderPage>;
  let flowService: RegistrationFlowService;
  let navigate: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterGenderPage],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();

    flowService = TestBed.inject(RegistrationFlowService);
    navigate = vi
      .spyOn(TestBed.inject(Router), 'navigate')
      .mockResolvedValue(true);
    fixture = TestBed.createComponent(RegisterGenderPage);
    fixture.detectChanges();
  });

  it('keeps Next disabled until a gender is picked', () => {
    const next = fixture.nativeElement.querySelector('#gender-step-next-btn') as HTMLButtonElement;
    expect(next.disabled).toBe(true);

    (fixture.nativeElement.querySelector('.gender-option') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(next.disabled).toBe(false);
  });

  it('stores the selected gender string and navigates to the age step', () => {
    const root: HTMLElement = fixture.nativeElement;
    const options = root.querySelectorAll('.gender-option') as NodeListOf<HTMLButtonElement>;

    expect(options).toHaveLength(2);
    options[0].click();
    fixture.detectChanges();
    (root.querySelector('#gender-step-next-btn') as HTMLButtonElement | null)?.click();

    expect(flowService.draft()['gender']).toBe('male');
    expect(navigate).toHaveBeenCalledWith(['../age'], {
      relativeTo: expect.anything(),
    });
  });

  it('restores a valid gender saved in the registration draft', () => {
    fixture.destroy();
    flowService.patch({ gender: 'male' });

    fixture = TestBed.createComponent(RegisterGenderPage);
    fixture.detectChanges();

    const selectedOption = fixture.nativeElement.querySelector(
      '.gender-option--selected',
    ) as HTMLButtonElement | null;
    expect(selectedOption?.getAttribute('aria-pressed')).toBe('true');
  });
});
