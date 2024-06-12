import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDocenteComponent } from './main-docente.component';

describe('MainDocenteComponent', () => {
  let component: MainDocenteComponent;
  let fixture: ComponentFixture<MainDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainDocenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
