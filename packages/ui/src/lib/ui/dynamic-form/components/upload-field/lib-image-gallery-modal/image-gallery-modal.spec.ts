import { provideTranslateService } from '@ngx-translate/core';
import { TestBed } from '@angular/core/testing';
import { ImageGalleryModal } from './image-gallery-modal';

describe('ImageGalleryModal', () => {
  async function render(images: string[] = [], open = false) {
    const fixture = TestBed.createComponent(ImageGalleryModal);
    fixture.componentRef.setInput('images', images);
    fixture.componentRef.setInput('open', open);
    await fixture.whenStable();
    return fixture;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageGalleryModal],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  it('should create', async () => {
    expect((await render()).componentInstance).toBeTruthy();
  });

  it('stays closed until `open` is set', async () => {
    const fixture = await render(['https://cdn.example.com/a.png']);
    expect(fixture.componentInstance.open()).toBe(false);
    expect(fixture.nativeElement.querySelector('dialog').hasAttribute('open')).toBe(false);
  });

  it('opens the native dialog and pages through the images in a loop', async () => {
    const fixture = await render(['a.png', 'b.png', 'c.png'], true);
    const el: HTMLElement = fixture.nativeElement;
    const src = () => el.querySelector('.gallery-image')?.getAttribute('src');

    expect(el.querySelector('dialog')?.hasAttribute('open')).toBe(true);
    expect(src()).toBe('a.png');

    el.querySelectorAll<HTMLButtonElement>('.gallery-nav.prev').forEach((b) => b.click());
    await fixture.whenStable();
    expect(src()).toBe('c.png');

    el.querySelectorAll<HTMLButtonElement>('.gallery-dot')[1].click();
    await fixture.whenStable();
    expect(src()).toBe('b.png');
  });

  it('closes through the close button', async () => {
    const fixture = await render(['a.png'], true);
    fixture.nativeElement.querySelector('.gallery-close').click();
    await fixture.whenStable();

    expect(fixture.componentInstance.open()).toBe(false);
    expect(fixture.nativeElement.querySelector('dialog').hasAttribute('open')).toBe(false);
  });
});
