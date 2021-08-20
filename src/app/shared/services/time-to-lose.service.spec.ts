import { TestBed } from '@angular/core/testing';

import { TimeToLoseService } from './time-to-lose.service';

describe('TimeToLoseService', () => {
  let service: TimeToLoseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeToLoseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
