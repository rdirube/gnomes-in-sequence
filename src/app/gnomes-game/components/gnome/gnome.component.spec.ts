import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GnomeComponent } from './gnome.component';

describe('GnomeComponent', () => {
  let component: GnomeComponent;
  let fixture: ComponentFixture<GnomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GnomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GnomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
