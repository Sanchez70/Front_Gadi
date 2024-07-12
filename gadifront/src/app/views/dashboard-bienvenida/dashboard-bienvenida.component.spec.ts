import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBienvenidaComponent } from './dashboard-bienvenida.component';

describe('DashboardBienvenidaComponent', () => {
  let component: DashboardBienvenidaComponent;
  let fixture: ComponentFixture<DashboardBienvenidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardBienvenidaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardBienvenidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
