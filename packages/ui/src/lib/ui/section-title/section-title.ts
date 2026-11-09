import { NgComponentOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Type,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DumbbellIcon } from '../icons/dumbbell-icon/dumbbell-icon';

export type SectionTitleSize = 'sm' | 'md' | 'lg';
export type SectionTitleLabelAlign = 'start' | 'center';


const SIZES: Record<SectionTitleSize, string> = {
  sm: 'text-[clamp(2.25rem,9vw,6.5rem)]',
  md: 'text-[clamp(2.5rem,14vw,11rem)]',
  lg: 'text-[clamp(2.5rem,14vw,14rem)]',
};

const LABEL_ALIGN: Record<SectionTitleLabelAlign, string> = {
  start: 'justify-self-start ms-[0.17em]',
  center: 'justify-self-center',
};

@Component({
  selector: 'lib-section-title',
  imports: [NgComponentOutlet],
  templateUrl: './section-title.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block overflow-hidden px-3 [--st-bg:transparent]',
    '[style.padding]': 'padding()',
    '[style.margin]': 'margin()',
  },
})
export class SectionTitle {
  private readonly sanitizer = inject(DomSanitizer);

  primaryText = input.required<string>();
  secondaryText = input<string>();
  icon = input<Type<unknown>>(DumbbellIcon);
  iconSvg = input<string>();
  showIcon = input(true, { transform: booleanAttribute });
  size = input<SectionTitleSize>('md');
  primaryTextFontSize = input<number>();
  secondaryTextFontSize = input<number>();
  labelAlign = input<SectionTitleLabelAlign>('start');
  padding = input<string>();
  margin = input<string>();

  protected readonly sizeClass = computed(() => SIZES[this.size()]);
  protected readonly safeIconSvg = computed(() => {
    const markup = this.iconSvg();
    return markup ? this.sanitizer.bypassSecurityTrustHtml(markup) : null;
  });
  protected readonly labelAlignClass = computed(
    () => LABEL_ALIGN[this.labelAlign()],
  );
}
