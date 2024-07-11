import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActividaComponent } from '../activida/activida.component';


describe('ActividaComponent', () => {
  let component: ActividaComponent;
  let fixture: ComponentFixture<ActividaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActividaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActividaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
