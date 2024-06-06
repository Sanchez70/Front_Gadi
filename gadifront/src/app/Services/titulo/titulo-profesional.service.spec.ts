import { TestBed } from '@angular/core/testing';

import { TituloProfesionalService } from './titulo-profesional.service';

describe('TituloProfesionalService', () => {
  let service: TituloProfesionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TituloProfesionalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
