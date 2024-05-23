import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoActividadComponent } from './tipo-actividad.component';

describe('TipoActividadComponent', () => {
  let component: TipoActividadComponent;
  let fixture: ComponentFixture<TipoActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TipoActividadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TipoActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
