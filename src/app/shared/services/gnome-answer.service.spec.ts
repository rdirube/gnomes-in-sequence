import { TestBed } from '@angular/core/testing';

import { GnomeAnswerService } from './gnome-answer.service';

describe('GnomeAnswerService', () => {
  let service: GnomeAnswerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GnomeAnswerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
