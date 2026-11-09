import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SmartCoach } from '../../../features/smart-coach/smart-coach';
import { Footer } from '../../../features/footer/footer';
import { FitnessMarquee } from '../fitness-marquee/fitness-marquee';
import { Navbar } from '../../../features/navbar/navbar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [Navbar, RouterOutlet, FitnessMarquee, Footer, SmartCoach],
  templateUrl: './main-layout.component.html',
  host: {
    class: 'block [--page-width:1490px] [--page-gutter:1rem] sm:[--page-gutter:1.5rem] lg:[--page-gutter:clamp(1rem,5.56vw,5rem)]',
  },
})
export class MainLayout {}
