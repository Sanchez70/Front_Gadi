import { TestBed } from '@angular/core/testing';

import { SrolService } from './srol.service';

describe('SrolService', () => {
  let service: SrolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SrolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
