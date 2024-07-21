import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteContraComponent } from './docentecontra.component';

describe('DocenteContraComponent', () => {
  let component: DocenteContraComponent;
  let fixture: ComponentFixture<DocenteContraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocenteContraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocenteContraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
