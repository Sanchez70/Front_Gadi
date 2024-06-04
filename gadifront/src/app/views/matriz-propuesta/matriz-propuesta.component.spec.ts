import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizPropuestaComponent } from './matriz-propuesta.component';

describe('MatrizPropuestaComponent', () => {
  let component: MatrizPropuestaComponent;
  let fixture: ComponentFixture<MatrizPropuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatrizPropuestaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatrizPropuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
