import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionTitle } from './question-title';

describe('QuestionTitle', () => {
  let fixture: ComponentFixture<QuestionTitle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionTitle],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionTitle);
    fixture.componentRef.setInput('text', 'How Old Are You?');
    fixture.detectChanges();
  });

  it('renders the text as a question heading', () => {
    expect(
      fixture.nativeElement.querySelector('h2')?.textContent?.trim(),
    ).toBe('How Old Are You?');
  });
});
