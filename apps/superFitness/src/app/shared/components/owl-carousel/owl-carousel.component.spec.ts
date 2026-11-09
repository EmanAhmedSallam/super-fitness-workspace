import { computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LanguageService } from '@org/i18n';
import { OwlCarouselComponent } from './owl-carousel.component';

describe('OwlCarousel horizontal gestures', () => {
  const rtl = signal(false);
  const navigation = signal({ disabled: false, next: { disabled: false }, prev: { disabled: false } });
  let component: OwlCarouselComponent<string>;
  let next: ReturnType<typeof vi.fn>;
  let prev: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(1000);
    rtl.set(false);
    navigation.set({ disabled: false, next: { disabled: false }, prev: { disabled: false } });
    TestBed.configureTestingModule({
      providers: [{ provide: LanguageService, useValue: { isRtl: computed(() => rtl()) } }],
    });
    component = TestBed.runInInjectionContext(() => new OwlCarouselComponent<string>());
    next = vi.fn();
    prev = vi.fn();
    Object.assign(component, {
      horizontalWheel: signal(true),
      carousel: { carouselLoaded: signal(true), navData: navigation, next, prev },
    });
  });

  afterEach(() => vi.useRealTimers());

  it('consumes horizontal gestures once per burst while keeping separate gestures usable', () => {
    const wheel = () => new WheelEvent('wheel', { deltaX: 40, deltaY: 2, cancelable: true });
    const first = wheel();
    component.onWheel(first);
    vi.advanceTimersByTime(20);
    const momentum = wheel();
    component.onWheel(momentum);
    expect(next).toHaveBeenCalledTimes(1);
    expect(first.defaultPrevented).toBe(true);
    expect(momentum.defaultPrevented).toBe(true);
    vi.advanceTimersByTime(200);
    component.onWheel(wheel());
    expect(next).toHaveBeenCalledTimes(2);
  });

  it('preserves vertical scrolling, zoom gestures, boundaries, and opt-out behavior', () => {
    for (const options of [{ deltaY: 80 }, { deltaX: 10, deltaY: 40 }, { deltaX: 40, ctrlKey: true }]) {
      const event = new WheelEvent('wheel', { ...options, cancelable: true });
      component.onWheel(event);
      expect(event.defaultPrevented).toBe(false);
    }
    navigation.set({ disabled: false, next: { disabled: true }, prev: { disabled: false } });
    const boundary = new WheelEvent('wheel', { deltaX: 40, cancelable: true });
    component.onWheel(boundary);
    expect(boundary.defaultPrevented).toBe(false);
    Object.assign(component, { horizontalWheel: signal(false) });
    component.onWheel(new WheelEvent('wheel', { deltaX: -40, cancelable: true }));
    expect(next).not.toHaveBeenCalled();
    expect(prev).not.toHaveBeenCalled();
  });

  it('mirrors horizontal direction in RTL and preserves reverse navigation', () => {
    rtl.set(true);
    component.onWheel(new WheelEvent('wheel', { deltaX: 40, cancelable: true }));
    expect(prev).toHaveBeenCalledTimes(1);
    component.onWheel(new WheelEvent('wheel', { deltaX: -40, cancelable: true }));
    expect(next).toHaveBeenCalledTimes(1);
  });
});
