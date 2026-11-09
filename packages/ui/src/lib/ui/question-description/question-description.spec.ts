import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionDescription } from './question-description';

describe('QuestionDescription', () => {
  let fixture: ComponentFixture<QuestionDescription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionDescription],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionDescription);
    fixture.componentRef.setInput('text', 'Choose a value for your plan.');
    fixture.detectChanges();
  });

  it('renders the text as a question description', () => {
    expect(
      fixture.nativeElement.querySelector('p')?.textContent?.trim(),
    ).toBe('Choose a value for your plan.');
  });
});
