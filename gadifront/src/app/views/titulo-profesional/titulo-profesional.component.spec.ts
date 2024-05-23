import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TituloProfesionalComponent } from './titulo-profesional.component';

describe('TituloProfesionalComponent', () => {
  let component: TituloProfesionalComponent;
  let fixture: ComponentFixture<TituloProfesionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TituloProfesionalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TituloProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
