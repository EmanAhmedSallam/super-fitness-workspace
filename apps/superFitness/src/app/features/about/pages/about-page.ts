import { Component } from '@angular/core';
import { AboutUs } from '../../home/components/about-us/about-us';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [AboutUs],
  templateUrl: './about-page.html',
})
export class AboutPage {}
