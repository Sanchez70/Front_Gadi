import { TestBed } from '@angular/core/testing';

import { GradoOcupacionalService } from './grado-ocupacional.service';

describe('GradoOcupacionalService', () => {
  let service: GradoOcupacionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GradoOcupacionalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
