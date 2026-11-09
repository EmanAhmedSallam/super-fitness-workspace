import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { RegistrationFlowService } from '../../services/registration-flow.service';
import { RegisterWeightPage } from './register-weight.page';

describe('RegisterWeightPage', () => {
  let fixture: ComponentFixture<RegisterWeightPage>;
  let flowService: RegistrationFlowService;
  let navigate: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterWeightPage],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();

    flowService = TestBed.inject(RegistrationFlowService);
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(RegisterWeightPage);
    fixture.detectChanges();
  });

  it('renders the numeric step and saves the selected weight before navigating', () => {
    const root: HTMLElement = fixture.nativeElement;

    expect(root.querySelector('app-numeric-registration-step')).toBeTruthy();
    expect(fixture.componentInstance.weight()).toBe(70);
    fixture.componentInstance.onNext(82);

    expect(flowService.draft()['weight']).toBe(82);
    expect(navigate).toHaveBeenCalledWith(['../height'], {
      relativeTo: expect.anything(),
    });
  });
});
