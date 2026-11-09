import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
  templateUrl: './skeleton-loader-card.component.html',
})
export class SkeletonLoaderCardComponent {}
