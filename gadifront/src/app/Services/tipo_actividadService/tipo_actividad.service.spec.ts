import { TestBed } from '@angular/core/testing';
import { tipo_actividadService } from './tipo_actividad.service';
describe('tipo_actividadService', () => {
  let service: tipo_actividadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(tipo_actividadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
