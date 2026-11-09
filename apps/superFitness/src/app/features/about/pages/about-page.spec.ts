import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import ar from '../../../../../public/assets/i18n/fitness/ar.json';
import en from '../../../../../public/assets/i18n/fitness/en.json';
import { AboutUs } from '../../landing/ui/about-us/about-us';
import { AboutPage } from './about-page';

describe('AboutPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPage],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  it('renders the existing AboutUs section without duplicating layout components', async () => {
    const fixture = TestBed.createComponent(AboutPage);
    await fixture.whenStable();

    const host: HTMLElement = fixture.nativeElement;
    expect(fixture.debugElement.queryAll(By.directive(AboutUs))).toHaveLength(1);
    expect(host.querySelector('main > app-about-us')).not.toBeNull();
    expect(host.querySelectorAll('app-about-us img')).toHaveLength(3);
    expect(host.querySelectorAll('app-about-us article')).toHaveLength(4);
    expect(host.querySelector('app-about-us lib-site-button')).not.toBeNull();
    expect(host.querySelector('app-navbar, app-fitness-marquee, app-footer')).toBeNull();
  });

  it('uses the existing English and Arabic About translations', async () => {
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', en);
    translate.setTranslation('ar', ar);
    const fixture = TestBed.createComponent(AboutPage);

    for (const [language, translations] of [['en', en], ['ar', ar]] as const) {
      translate.use(language);
      await fixture.whenStable();

      const host: HTMLElement = fixture.nativeElement;
      expect(host.textContent).toContain(translations.landing.aboutUs.description);
      expect(host.querySelector('img')?.alt).toBe(translations.landing.aboutUs.images.kettlebell);
    }
  });
});
