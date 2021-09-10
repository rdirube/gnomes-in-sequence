import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurpriseAnimationComponent } from './surprise-animation.component';

describe('SurpriseAnimationComponent', () => {
  let component: SurpriseAnimationComponent;
  let fixture: ComponentFixture<SurpriseAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurpriseAnimationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurpriseAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
