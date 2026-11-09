import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParagraphDescription } from './paragraph-description';

describe('ParagraphDescription', () => {
  let fixture: ComponentFixture<ParagraphDescription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParagraphDescription],
    }).compileComponents();
    fixture = TestBed.createComponent(ParagraphDescription);
    fixture.componentRef.setInput('text', 'Training for your goals.');
    fixture.detectChanges();
  });

  it('renders semantic text and updates its content', () => {
    expect(fixture.nativeElement.querySelector('p').textContent.trim()).toBe(
      'Training for your goals.',
    );
    fixture.componentRef.setInput('text', 'Updated description');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p').textContent.trim()).toBe(
      'Updated description',
    );
  });

  it('provides light and dark text colors', () => {
    const element: HTMLElement = fixture.nativeElement.querySelector('p');
    expect(element.classList.contains('text-gray-700')).toBe(true);
    expect(element.classList.contains('dark:text-gray-300')).toBe(true);
  });

  it('defaults to start alignment and supports center and end', () => {
    const element: HTMLElement = fixture.nativeElement.querySelector('p');
    expect(element.style.textAlign).toBe('start');
    for (const align of ['center', 'end']) {
      fixture.componentRef.setInput('align', align);
      fixture.detectChanges();
      expect(element.style.textAlign).toBe(align);
    }
  });
});
