import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubrosComponent } from './rubros.component';

describe('RubrosComponent', () => {
  let component: RubrosComponent;
  let fixture: ComponentFixture<RubrosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RubrosComponent]
    });
    fixture = TestBed.createComponent(RubrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
