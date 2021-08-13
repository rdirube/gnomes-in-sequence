import { TestBed } from '@angular/core/testing';

import { GnomesChallengeService } from './gnomes-challenge.service';

describe('GnomesChallengeService', () => {
  let service: GnomesChallengeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GnomesChallengeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
