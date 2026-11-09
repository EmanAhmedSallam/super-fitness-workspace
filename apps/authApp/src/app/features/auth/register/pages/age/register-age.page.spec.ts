import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { RegistrationFlowService } from '../../services/registration-flow.service';
import { RegisterAgePage } from './register-age.page';

describe('RegisterAgePage', () => {
  let fixture: ComponentFixture<RegisterAgePage>;
  let flowService: RegistrationFlowService;
  let navigate: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterAgePage],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();

    flowService = TestBed.inject(RegistrationFlowService);
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(RegisterAgePage);
    fixture.detectChanges();
  });

  it('renders the numeric step and saves the selected age before navigating', () => {
    const root: HTMLElement = fixture.nativeElement;

    expect(root.querySelector('app-numeric-registration-step')).toBeTruthy();
    expect(fixture.componentInstance.age()).toBe(25);
    fixture.componentInstance.onNext(36);

    expect(flowService.draft()['age']).toBe(36);
    expect(navigate).toHaveBeenCalledWith(['../weight'], {
      relativeTo: expect.anything(),
    });
  });
});
