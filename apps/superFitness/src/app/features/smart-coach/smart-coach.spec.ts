import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmartCoach } from './smart-coach';

describe('SmartCoach', () => {
  let component: SmartCoach;
  let fixture: ComponentFixture<SmartCoach>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartCoach]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SmartCoach);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
