import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributivoAsignaturaComponent } from './distributivo-asignatura.component';

describe('DistributivoAsignaturaComponent', () => {
  let component: DistributivoAsignaturaComponent;
  let fixture: ComponentFixture<DistributivoAsignaturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DistributivoAsignaturaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DistributivoAsignaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
