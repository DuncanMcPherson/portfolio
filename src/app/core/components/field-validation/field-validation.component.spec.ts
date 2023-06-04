import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldValidationComponent } from './field-validation.component';

// TODO: Write new tests

describe('FieldValidationComponent', () => {
  let component: FieldValidationComponent;
  let fixture: ComponentFixture<FieldValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FieldValidationComponent]
    });
    fixture = TestBed.createComponent(FieldValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
