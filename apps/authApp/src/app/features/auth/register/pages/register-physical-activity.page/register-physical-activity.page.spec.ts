import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { AuthRepository } from '@super-fitness/data-access-user';
import { EMPTY } from 'rxjs';
import { RegistrationFlowService } from '../../services/registration-flow.service';
import { RegisterPhysicalActivityPage } from './register-physical-activity.page';

describe('RegisterPhysicalActivityPage', () => {
  let fixture: ComponentFixture<RegisterPhysicalActivityPage>;
  let flowService: RegistrationFlowService;
  let signup: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    signup = vi.fn(() => EMPTY);

    await TestBed.configureTestingModule({
      imports: [RegisterPhysicalActivityPage],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: AuthRepository, useValue: { signup, signin: vi.fn(() => EMPTY) } },
      ],
    }).compileComponents();

    flowService = TestBed.inject(RegistrationFlowService);
    flowService.patch({ goal: 'get fitter' });
    fixture = TestBed.createComponent(RegisterPhysicalActivityPage);
    fixture.detectChanges();
  });

  it('submits the registration draft with the selected activity level', () => {
    const root: HTMLElement = fixture.nativeElement;
    const options = root.querySelectorAll<HTMLButtonElement>('.choice-option');
    expect(options).toHaveLength(5);

    options[3].click();
    fixture.detectChanges();
    root.querySelector<HTMLButtonElement>('.choice-next')?.click();

    expect(flowService.draft()).toEqual({ goal: 'get fitter', activityLevel: 'level4' });
    expect(signup).toHaveBeenCalledWith(
      expect.objectContaining({ goal: 'get fitter', activityLevel: 'level4' }),
    );
  });
});
