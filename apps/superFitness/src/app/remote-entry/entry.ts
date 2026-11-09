import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'app-super-fitness-entry',
  template: `
    <router-outlet />
  `,
})
export class RemoteEntry { }
