import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParagraphTitle } from './paragraph-title';

describe('ParagraphTitle', () => {
  let fixture: ComponentFixture<ParagraphTitle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParagraphTitle],
    }).compileComponents();
    fixture = TestBed.createComponent(ParagraphTitle);
    fixture.componentRef.setInput('segments', [
      { text: 'Build ' },
      { text: 'strength', highlight: true },
      { text: ' and ' },
      { text: 'confidence', highlight: true },
    ]);
    fixture.detectChanges();
  });

  it('renders semantic text and updates its content', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent.trim()).toBe(
      'Build strength and confidence',
    );
    fixture.componentRef.setInput('segments', [{ text: 'Updated title' }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h2').textContent.trim()).toBe(
      'Updated title',
    );
  });

  it('provides light and dark text colors', () => {
    const element: HTMLElement = fixture.nativeElement.querySelector('h2');
    expect(element.classList.contains('text-gray-900')).toBe(true);
    expect(element.classList.contains('dark:text-white')).toBe(true);
  });

  it('defaults to start alignment and supports center and end', () => {
    const element: HTMLElement = fixture.nativeElement.querySelector('h2');
    expect(element.style.textAlign).toBe('start');
    for (const align of ['center', 'end']) {
      fixture.componentRef.setInput('align', align);
      fixture.detectChanges();
      expect(element.style.textAlign).toBe(align);
    }
  });

  it('keeps multiple highlighted segments orange and other segments inheriting', () => {
    const spans: HTMLSpanElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('span'),
    );
    expect(
      spans
        .filter((span) => span.classList.contains('text-[#FF4100]'))
        .map((span) => span.textContent),
    ).toEqual(['strength', 'confidence']);
    expect(spans[0].className).toBe('');
    expect(spans[2].className).toBe('');
  });
});
