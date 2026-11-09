import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { HeroSection } from './hero-section';

describe('HeroSection', () => {
  let component: HeroSection;
  let fixture: ComponentFixture<HeroSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSection],
      providers: [provideRouter([]), provideTranslateService()],
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeroSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the athlete, fitness statistics, and assistant prompt without hero buttons', () => {
    const host: HTMLElement = fixture.nativeElement;

    expect(host.querySelector('.hero__athlete')).not.toBeNull();
    expect(host.querySelectorAll('.hero__stat')).toHaveLength(3);
    expect(host.querySelector('.hero__actions')).toBeNull();
    expect(host.querySelector('.hero__assistant')).not.toBeNull();
  });
});
