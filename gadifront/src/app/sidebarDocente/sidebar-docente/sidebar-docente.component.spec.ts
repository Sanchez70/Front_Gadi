import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarDocenteComponent } from './sidebar-docente.component';

describe('SidebarDocenteComponent', () => {
  let component: SidebarDocenteComponent;
  let fixture: ComponentFixture<SidebarDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarDocenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
