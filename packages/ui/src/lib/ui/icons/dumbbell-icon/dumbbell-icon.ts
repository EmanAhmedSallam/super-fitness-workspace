import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-dumbbell-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 116 64"
      fill="none"
      stroke="currentColor"
      stroke-width="3.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="size-full"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M10 18H5.5A4.5 4.5 0 0 0 1 22.5v19A4.5 4.5 0 0 0 5.5 46H10" />
      <rect x="10" y="8" width="13" height="48" rx="6.5" />
      <rect x="23" y="3" width="16" height="58" rx="8" />
      <path d="M39 26.5h38M39 37.5h32" />
      <rect x="77" y="3" width="16" height="58" rx="8" />
      <rect x="93" y="8" width="13" height="48" rx="6.5" />
      <path d="M106 18h4.5a4.5 4.5 0 0 1 4.5 4.5v19a4.5 4.5 0 0 1-4.5 4.5H106" />
    </svg>
  `,
  host: { class: 'inline-flex h-[1em] w-[1.8125em] leading-none' },
})
export class DumbbellIcon {}
