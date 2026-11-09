import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [TranslatePipe],
  selector: 'app-footer',
  templateUrl: './footer.html',
})
export class Footer {
}
