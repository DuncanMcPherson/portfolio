// TODO: Unit tests
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicProjectCardComponent } from './public-project-card.component';

describe('PublicProjectCardComponent', () => {
  let component: PublicProjectCardComponent;
  let fixture: ComponentFixture<PublicProjectCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicProjectCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicProjectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
