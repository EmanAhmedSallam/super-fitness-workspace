import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabbedList } from './tabbed-list';

describe('TabbedList', () => {
  let fixture: ComponentFixture<TabbedList>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabbedList],
    }).compileComponents();
    fixture = TestBed.createComponent(TabbedList);
    fixture.componentRef.setInput('tabs', [
      { id: 'breakfast', label: 'Breakfast' },
      { id: 'dinner', label: 'Dinner' },
    ]);
    fixture.componentRef.setInput('selectedTabId', 'breakfast');
    fixture.componentRef.setInput('items', [
      { id: '1', title: 'Pasta', image: 'pasta.jpg', lines: ['Line one', 'Line two'] },
      { id: '2', title: 'Salad' },
    ]);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('renders the tabs from input and marks the selected one', () => {
    const tabs = Array.from(element.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    expect(tabs.map((tab) => tab.textContent?.trim())).toEqual(['Breakfast', 'Dinner']);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
  });

  it('emits and updates the selection when another tab is clicked', () => {
    const emitted: string[] = [];
    fixture.componentInstance.tabSelected.subscribe((id) => emitted.push(id));
    const tab = element.querySelectorAll<HTMLButtonElement>('[role="tab"]')[1];
    tab.scrollIntoView = () => undefined;
    tab.click();
    fixture.detectChanges();
    expect(emitted).toEqual(['dinner']);
    expect(fixture.componentInstance.selectedTabId()).toBe('dinner');
  });

  it('renders one row per item with its lines, and the action only when enabled', () => {
    expect(element.querySelectorAll('li')).toHaveLength(2);
    expect(element.querySelector('li img')?.getAttribute('src')).toBe('pasta.jpg');
    expect(element.querySelectorAll('li:first-child p')).toHaveLength(2);
    expect(element.querySelector('li button')).toBeNull();
    fixture.componentRef.setInput('showAction', true);
    fixture.detectChanges();
    expect(element.querySelectorAll('li button')).toHaveLength(2);
  });

  it('caps its height so the list scrolls instead of growing past it', () => {
    expect(element.style.maxHeight).toBe('100dvh');
    fixture.componentRef.setInput('maxHeight', '480px');
    fixture.detectChanges();
    expect(element.style.maxHeight).toBe('480px');
    expect(element.querySelector('[role="tabpanel"]')?.classList.contains('overflow-y-auto')).toBe(true);
  });

  it('shows the empty text when there are no items', () => {
    fixture.componentRef.setInput('items', []);
    fixture.componentRef.setInput('emptyText', 'Nothing here');
    fixture.detectChanges();
    expect(element.querySelector('[role="tabpanel"] p')?.textContent?.trim()).toBe('Nothing here');
  });
});
