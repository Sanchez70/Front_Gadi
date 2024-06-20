import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarActividadesComponent } from './editar-actividades.component';

describe('EditarActividadesComponent', () => {
  let component: EditarActividadesComponent;
  let fixture: ComponentFixture<EditarActividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarActividadesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
