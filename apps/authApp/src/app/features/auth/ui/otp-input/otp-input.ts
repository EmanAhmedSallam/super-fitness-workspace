import {
  Component,
  ElementRef,
  computed,
  effect,
  input,
  model,
  output,
  signal,
  untracked,
  viewChildren,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

const NON_DIGITS = /\D/g;

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.html',
  imports: [TranslatePipe],
  host: { class: 'block' },
})
export class OtpInput {
  length = input(4);
  label = input('');
  disabled = input(false);
  invalid = input(false);

  value = model('');
  completed = output<string>();

  private readonly inputs = viewChildren<ElementRef<HTMLInputElement>>('cell');
  private readonly digits = signal<string[]>([]);

  protected readonly cells = computed(() =>
    Array.from({ length: this.length() }, (_, i) => this.digits()[i] ?? '')
  );

  constructor() {
    effect(() => {
      const value = this.value();
      if (value !== untracked(() => this.digits().join(''))) {
        this.digits.set(value.replace(NON_DIGITS, '').slice(0, this.length()).split(''));
      }
    });
  }

  focus(): void {
    const firstEmpty = this.cells().findIndex((d) => !d);
    this.focusAt(firstEmpty === -1 ? this.length() - 1 : firstEmpty);
  }

  protected onInput(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const typed = target.value.replace(NON_DIGITS, '');

    if (typed.length > 1) {
      this.fillFrom(index, typed);
      return;
    }

    target.value = typed;
    this.setDigit(index, typed);
    if (typed) this.focusAt(index + 1);
  }

  protected onKeydown(index: number, event: KeyboardEvent): void {
    switch (event.key) {
      case 'Backspace':
        if (this.cells()[index]) return;
        event.preventDefault();
        this.setDigit(index - 1, '');
        this.focusAt(index - 1);
        return;
      case 'ArrowLeft':
        event.preventDefault();
        this.focusAt(index - 1);
        return;
      case 'ArrowRight':
        event.preventDefault();
        this.focusAt(index + 1);
        return;
    }
  }

  protected onPaste(index: number, event: ClipboardEvent): void {
    const pasted = (event.clipboardData?.getData('text') ?? '').replace(NON_DIGITS, '');
    event.preventDefault();
    if (!pasted) return;

    this.fillFrom(pasted.length >= this.length() ? 0 : index, pasted);
  }

  protected select(index: number): void {
    this.inputs()[index]?.nativeElement.select();
  }

  private fillFrom(start: number, text: string): void {
    const next = [...this.cells()];
    const chars = text.slice(0, this.length() - start).split('');
    chars.forEach((char, offset) => (next[start + offset] = char));

    this.commit(next);
    this.focusAt(Math.min(start + chars.length, this.length() - 1));
  }

  private setDigit(index: number, digit: string): void {
    if (index < 0 || index >= this.length()) return;

    const next = [...this.cells()];
    next[index] = digit;
    this.commit(next);
  }

  private commit(next: string[]): void {
    this.digits.set(next);

    const code = next.join('');
    this.value.set(code);
    if (code.length === this.length() && next.every(Boolean)) this.completed.emit(code);
  }

  private focusAt(index: number): void {
    if (index < 0 || index >= this.length()) return;
    this.inputs()[index]?.nativeElement.focus();
  }
}
