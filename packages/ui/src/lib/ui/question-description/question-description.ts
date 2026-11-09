import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-question-description',
  templateUrl: './question-description.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionDescription {
  text = input.required<string>();
}
