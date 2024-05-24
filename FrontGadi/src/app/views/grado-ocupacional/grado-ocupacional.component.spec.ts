import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradoOcupacionalComponent } from './grado-ocupacional.component';

describe('GradoOcupacionalComponent', () => {
  let component: GradoOcupacionalComponent;
  let fixture: ComponentFixture<GradoOcupacionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GradoOcupacionalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GradoOcupacionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
