import { TestBed } from '@angular/core/testing';
import { DistributivoActividadService } from './distributivo_actividad.service';

describe('DistributivoActividadService', () => {
  let service: DistributivoActividadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistributivoActividadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
