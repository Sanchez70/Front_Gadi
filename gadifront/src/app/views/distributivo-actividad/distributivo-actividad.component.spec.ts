import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributivoActividadComponent } from './distributivo-actividad.component';

describe('DistributivoActividadComponent', () => {
  let component: DistributivoActividadComponent;
  let fixture: ComponentFixture<DistributivoActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DistributivoActividadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DistributivoActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
