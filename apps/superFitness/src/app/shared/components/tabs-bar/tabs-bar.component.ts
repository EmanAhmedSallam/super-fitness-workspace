import { Component, input, output } from '@angular/core';

export interface TabItem {
  id: string;
  label: string;
}

@Component({
  selector: 'app-tabs-bar',
  standalone: true,
  templateUrl: './tabs-bar.component.html',
  styleUrl: './tabs-bar.component.scss',
})
export class TabsBarComponent {
  readonly tabs = input.required<TabItem[]>();
  readonly selectedId = input<string | null>(null);
  readonly widthClass = input('w-[100%]');

  readonly tabSelected = output<string>();

  select(id: string, event: Event): void {
    this.tabSelected.emit(id);
    (event.currentTarget as HTMLElement).scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }
}
