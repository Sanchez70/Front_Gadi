import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorReporteComponent } from './director-reporte.component';

describe('DirectorReporteComponent', () => {
  let component: DirectorReporteComponent;
  let fixture: ComponentFixture<DirectorReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirectorReporteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirectorReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
