import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-workout-highlights',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './workout-highlights.html',
  styleUrl: './workout-highlights.scss',
})
export class WorkoutHighlights {
  readonly highlights = [0, 1, 2];
}
