import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreacionComponent } from './admin-creacion.component';

describe('AdminCreacionComponent', () => {
  let component: AdminCreacionComponent;
  let fixture: ComponentFixture<AdminCreacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCreacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCreacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
