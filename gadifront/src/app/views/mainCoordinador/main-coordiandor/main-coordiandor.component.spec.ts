import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCoordiandorComponent } from './main-coordiandor.component';

describe('MainCoordiandorComponent', () => {
  let component: MainCoordiandorComponent;
  let fixture: ComponentFixture<MainCoordiandorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainCoordiandorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainCoordiandorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
