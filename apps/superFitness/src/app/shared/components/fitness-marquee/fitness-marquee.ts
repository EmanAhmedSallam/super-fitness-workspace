import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-fitness-marquee',
  standalone: true,
  host: { class: 'block' },
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fitness-marquee.html',
  styleUrl: './fitness-marquee.css',
})
export class FitnessMarquee {
  // Translation keys; rendered through the translate pipe in the template
  protected readonly items = [
    'landing.marquee.items.fitnessClasses',
    'landing.marquee.items.outdoorOnlineTrainers',
    'landing.marquee.items.personalTraining',
    'landing.marquee.items.liveClasses',
    'landing.marquee.items.personalTrainers',
  ];

  // Repeat the list so each half is wider than large screens (no empty gap while looping)
  protected readonly loopItems = Array.from({ length: 3 }, () => this.items).flat();
}
