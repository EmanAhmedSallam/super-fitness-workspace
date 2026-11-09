import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthRepository } from '@super-fitness/data-access-user';
import { EMPTY } from 'rxjs';
import { RegistrationFlowService } from '../../services/registration-flow.service';
import { RegisterAccountPage } from './register-account.page';

describe('RegisterAccountPage', () => {
  let fixture: ComponentFixture<RegisterAccountPage>;
  let flowService: RegistrationFlowService;
  let navigate: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterAccountPage],
      providers: [
        provideRouter([]),
        {
          provide: AuthRepository,
          useValue: { signup: vi.fn(() => EMPTY), signin: vi.fn(() => EMPTY) },
        },
      ],
    }).compileComponents();

    flowService = TestBed.inject(RegistrationFlowService);
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(RegisterAccountPage);
    fixture.detectChanges();
  });

  it('renders the account step and continues to gender with submitted values saved', () => {
    const root: HTMLElement = fixture.nativeElement;
    const values = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      password: 'Passw0rd!',
      rePassword: 'Passw0rd!',
    };

    expect(root.querySelector('app-register-account-step')).toBeTruthy();
    fixture.componentInstance.next(values);

    expect(flowService.draft()).toEqual(values);
    expect(navigate).toHaveBeenCalledWith(['../gender'], {
      relativeTo: expect.anything(),
    });
  });
});
