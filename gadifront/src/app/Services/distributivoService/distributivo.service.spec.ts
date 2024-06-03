import { TestBed } from '@angular/core/testing';

import { DistributivoService } from './distributivo.service';

describe('DistributivoService', () => {
  let service: DistributivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistributivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
