import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lib-step-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './step-progress.html',
  styleUrl: './step-progress.css',
  host: { class: 'stp' },
})
export class StepProgress {
  current = input.required<number>();
  total = input.required<number>();

  private readonly CIRCUMFERENCE = 2 * Math.PI * 22;
  protected readonly dashOffset = computed(
    () => this.CIRCUMFERENCE * (1 - this.current() / this.total()),
  );
}

