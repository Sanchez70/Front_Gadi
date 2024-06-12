import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarCoordinadorComponent } from './sidebar-coordinador.component';

describe('SidebarCoordinadorComponent', () => {
  let component: SidebarCoordinadorComponent;
  let fixture: ComponentFixture<SidebarCoordinadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarCoordinadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarCoordinadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
