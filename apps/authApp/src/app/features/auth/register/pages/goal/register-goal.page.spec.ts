import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { RegistrationFlowService } from '../../services/registration-flow.service';
import { RegisterGoalPage } from './register-goal.page';

describe('RegisterGoalPage', () => {
  let fixture: ComponentFixture<RegisterGoalPage>;
  let flowService: RegistrationFlowService;
  let navigate: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterGoalPage],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();

    flowService = TestBed.inject(RegistrationFlowService);
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(RegisterGoalPage);
    fixture.detectChanges();
  });

  it('keeps Next disabled until a goal is picked', () => {
    const next: HTMLButtonElement = fixture.nativeElement.querySelector('.choice-next');
    expect(next.disabled).toBe(true);
  });

  it('stores the selected goal and navigates to the activity step', () => {
    const root: HTMLElement = fixture.nativeElement;
    const options = root.querySelectorAll<HTMLButtonElement>('.choice-option');
    expect(options).toHaveLength(5);

    options[2].click();
    fixture.detectChanges();
    root.querySelector<HTMLButtonElement>('.choice-next')?.click();

    expect(flowService.draft()['goal']).toBe('get fitter');
    expect(navigate).toHaveBeenCalledWith(['../activity'], {
      relativeTo: expect.anything(),
    });
  });
});
