import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface ParagraphTitleSegment {
  text: string;
  highlight?: boolean;
}

@Component({
  selector: 'lib-paragraph-title',
  templateUrl: './paragraph-title.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParagraphTitle {
  segments = input.required<readonly ParagraphTitleSegment[]>();
  align = input<'start' | 'center' | 'end'>('start');
}
