import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { RegistrationFlowService } from '../../services/registration-flow.service';
import { RegisterHeightPage } from './register-height.page';

describe('RegisterHeightPage', () => {
  let fixture: ComponentFixture<RegisterHeightPage>;
  let flowService: RegistrationFlowService;
  let navigate: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterHeightPage],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();

    flowService = TestBed.inject(RegistrationFlowService);
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(RegisterHeightPage);
    fixture.detectChanges();
  });

  it('renders the numeric step and saves the selected height before navigating', () => {
    const root: HTMLElement = fixture.nativeElement;

    expect(root.querySelector('app-numeric-registration-step')).toBeTruthy();
    expect(fixture.componentInstance.height()).toBe(175);
    fixture.componentInstance.onNext(180);

    expect(flowService.draft()['height']).toBe(180);
    expect(navigate).toHaveBeenCalledWith(['../goal'], {
      relativeTo: expect.anything(),
    });
  });
});
