import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudAsignaturaComponent } from './crud-asignatura.component';

describe('CrudAsignaturaComponent', () => {
  let component: CrudAsignaturaComponent;
  let fixture: ComponentFixture<CrudAsignaturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudAsignaturaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudAsignaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
