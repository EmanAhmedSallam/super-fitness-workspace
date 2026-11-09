import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  computed,
  inject,
  input,
  model,
} from '@angular/core';


@Component({
  selector: 'lib-numeric-wheel-selector',
  templateUrl: './numeric-wheel-selector.html',
  styleUrl: './numeric-wheel-selector.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(keydown)': 'onKeyDown($event)',
    '[attr.tabindex]': '"0"',
    '[attr.role]': '"spinbutton"',
    '[attr.aria-valuemin]': 'min()',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-label]': 'unit() ? value() + " " + unit() : value()',
  },
})
export class NumericWheelSelector implements OnInit {
  min = input.required<number>();
  max = input.required<number>();
  step = input(1);
  unit = input<string>();
  value = model.required<number>();

  /** Items visible on each side of the selected value. */
  private readonly SIDES = 4;
  /** Horizontal pixels that equal one step change during a drag. */
  private readonly STEP_PX = 44;

  private readonly el = inject(ElementRef<HTMLElement>);

  // ── computed items list ──────────────────────────────────────────────────

  protected readonly items = computed(() => {
    const centre = this.value();
    const s = this.step();
    const result: Array<{ val: number; offset: number; inRange: boolean }> = [];
    for (let d = -this.SIDES; d <= this.SIDES; d++) {
      const v = centre + d * s;
      result.push({ val: v, offset: d, inRange: v >= this.min() && v <= this.max() });
    }
    return result;
  });

  // ── wheel listener (must be non-passive for preventDefault) ────────────

  ngOnInit(): void {
    this.el.nativeElement.addEventListener(
      'wheel',
      (e: WheelEvent) => {
        e.preventDefault();
        this.move(e.deltaY > 0 ? 1 : -1);
      },
      { passive: false },
    );
  }

  // ── pointer drag ─────────────────────────────────────────────────────────

  private dragging = false;
  private dragX0 = 0;
  private dragVal0 = 0;

  onPointerDown(e: PointerEvent, track: HTMLElement): void {
    this.dragging = true;
    this.dragX0 = e.clientX;
    this.dragVal0 = this.value();
    track.setPointerCapture(e.pointerId);
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.dragging) return;
    const steps = -Math.round((e.clientX - this.dragX0) / this.STEP_PX);
    this.clamp(this.dragVal0 + steps * this.step());
  }

  onPointerUp(): void {
    this.dragging = false;
  }

  // ── keyboard ─────────────────────────────────────────────────────────────

  onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.move(-1);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.move(1);
    }
  }

  // ── click ─────────────────────────────────────────────────────────────────

  protected pick(val: number): void {
    if (val >= this.min() && val <= this.max()) {
      this.value.set(val);
    }
  }

  // ── style helpers ─────────────────────────────────────────────────────────

  private static readonly OPACITY = [1, 0.55, 0.28, 0.12, 0.05] as const;
  private static readonly FONT_SIZE = [
    '2.75rem',
    '1.65rem',
    '1.1rem',
    '0.82rem',
    '0.65rem',
  ] as const;

  protected getOpacity(offset: number): number {
    return NumericWheelSelector.OPACITY[Math.min(Math.abs(offset), 4)];
  }

  protected getFontSize(offset: number): string {
    return NumericWheelSelector.FONT_SIZE[Math.min(Math.abs(offset), 4)];
  }

  protected getFontWeight(offset: number): number {
    return Math.abs(offset) === 0 ? 700 : Math.abs(offset) === 1 ? 500 : 400;
  }

  // ── private ───────────────────────────────────────────────────────────────

  private move(n: number): void {
    this.clamp(this.value() + n * this.step());
  }

  private clamp(v: number): void {
    this.value.set(Math.max(this.min(), Math.min(this.max(), v)));
  }
}
