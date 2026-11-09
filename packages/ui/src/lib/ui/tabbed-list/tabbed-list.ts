import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  model,
  output,
  TemplateRef,
} from '@angular/core';

export interface TabbedListTab {
  id: string;
  label: string;
}

export interface TabbedListItem<T = unknown> {
  id: string;
  title: string;
  image?: string;
  // Each entry renders on its own line under the title (e.g. "3 Groups * 15 Times", a short description)
  lines?: readonly string[];
  // Original API object, handed back untouched in the outputs
  data?: T;
}

@Component({
  selector: 'lib-tabbed-list',
  imports: [NgTemplateOutlet],
  templateUrl: './tabbed-list.html',
  styleUrl: './tabbed-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex min-h-0 w-full flex-col',
    '[style.max-height]': 'maxHeight()',
  },
})
export class TabbedList<T = unknown> {
  tabs = input<readonly TabbedListTab[]>([]);
  selectedTabId = model<string | null>(null);
  items = input<readonly TabbedListItem<T>[]>([]);
  // Anything taller than this scrolls inside the list; the tabs stay pinned on top
  maxHeight = input<string>('100dvh');
  showAction = input(false, { transform: booleanAttribute });
  loading = input(false, { transform: booleanAttribute });
  loadingText = input<string>('');
  emptyText = input<string>('');
  actionLabel = input<string>('');

  tabSelected = output<string>();
  itemSelected = output<TabbedListItem<T>>();
  actionClicked = output<TabbedListItem<T>>();

  // Optional <ng-template #item let-item> to fully replace the default row
  protected readonly itemTemplate =
    contentChild<TemplateRef<{ $implicit: TabbedListItem<T> }>>('item');

  protected selectTab(id: string, event: Event): void {
    if (this.selectedTabId() !== id) {
      this.selectedTabId.set(id);
      this.tabSelected.emit(id);
    }
    (event.currentTarget as HTMLElement).scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }

  protected onAction(item: TabbedListItem<T>, event: Event): void {
    event.stopPropagation();
    this.actionClicked.emit(item);
  }
}
