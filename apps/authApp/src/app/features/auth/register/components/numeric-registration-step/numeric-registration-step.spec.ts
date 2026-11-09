import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { NumericRegistrationStep } from './numeric-registration-step';

@Component({
  imports: [NumericRegistrationStep],
  template: `
    <ng-template
      #customSelector
      let-value="value"
      let-setValue="setValue"
    >
      <button id="custom-selector" (click)="setValue(value + 1)">
        Custom {{ value }}
      </button>
    </ng-template>

    <app-numeric-registration-step
      [currentStep]="2"
      [totalSteps]="6"
      title="Age"
      description="Choose your age"
      [min]="10"
      [max]="100"
      unit="Years"
      [selectorTemplate]="customSelector"
      [(value)]="value"
      (next)="submitted.set($event)"
    />
  `,
})
class CustomSelectorHost {
  readonly value = signal(36);
  readonly submitted = signal<number | null>(null);
}

describe('NumericRegistrationStep', () => {
  let fixture: ComponentFixture<CustomSelectorHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSelectorHost],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSelectorHost);
    fixture.detectChanges();
  });

  it('uses the wheel selector when no replacement template is provided', async () => {
    const defaultFixture = TestBed.createComponent(NumericRegistrationStep);
    defaultFixture.componentRef.setInput('currentStep', 2);
    defaultFixture.componentRef.setInput('totalSteps', 6);
    defaultFixture.componentRef.setInput('title', 'Age');
    defaultFixture.componentRef.setInput('description', 'Choose your age');
    defaultFixture.componentRef.setInput('min', 10);
    defaultFixture.componentRef.setInput('max', 100);
    defaultFixture.componentRef.setInput('value', 36);
    defaultFixture.detectChanges();
    await defaultFixture.whenStable();

    expect(
      defaultFixture.nativeElement.querySelector('lib-numeric-wheel-selector'),
    ).toBeTruthy();
    expect(defaultFixture.nativeElement.querySelector('#custom-selector')).toBeNull();
  });

  it('renders a replacement template and sends its selected value on Next', () => {
    const root: HTMLElement = fixture.nativeElement;

    expect(root.querySelector('lib-numeric-wheel-selector')).toBeNull();
    const customSelector = root.querySelector<HTMLButtonElement>(
      '#custom-selector',
    );
    expect(customSelector?.textContent).toContain('Custom 36');

    customSelector?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(37);

    root.querySelector<HTMLButtonElement>('#numeric-step-next-btn')?.click();
    expect(fixture.componentInstance.submitted()).toBe(37);
  });
});
