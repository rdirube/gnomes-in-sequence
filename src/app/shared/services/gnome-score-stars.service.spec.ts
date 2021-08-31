import { TestBed } from '@angular/core/testing';

import { GnomeScoreStarsService } from './gnome-score-stars.service';

describe('GnomeScoreStarsService', () => {
  let service: GnomeScoreStarsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GnomeScoreStarsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
