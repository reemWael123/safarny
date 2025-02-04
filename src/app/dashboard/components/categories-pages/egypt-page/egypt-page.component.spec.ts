import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgyptPageComponent } from './egypt-page.component';

describe('EgyptPageComponent', () => {
  let component: EgyptPageComponent;
  let fixture: ComponentFixture<EgyptPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EgyptPageComponent]
    });
    fixture = TestBed.createComponent(EgyptPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
