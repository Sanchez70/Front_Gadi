import { TestBed } from '@angular/core/testing';

import { DistributivoAsignaturaService } from './distributivo-asignatura.service';

describe('DistributivoAsignaturaService', () => {
  let service: DistributivoAsignaturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistributivoAsignaturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
