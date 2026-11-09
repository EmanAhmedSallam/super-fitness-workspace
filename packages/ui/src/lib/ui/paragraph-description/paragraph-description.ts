import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-paragraph-description',
  templateUrl: './paragraph-description.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParagraphDescription {
  text = input.required<string>();
  align = input<'start' | 'center' | 'end'>('start');
}
