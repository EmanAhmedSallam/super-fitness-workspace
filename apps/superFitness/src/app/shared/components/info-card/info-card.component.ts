import { Component,  input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.scss',
})
export class InfoCardComponent {
  image = input.required<string>();
  title = input.required<string>();
  buttonText = input<string>('workouts.explore');

  buttonClick = output<void>();

  handleButtonClick(){
    this.buttonClick.emit();
  }
}
