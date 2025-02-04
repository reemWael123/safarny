import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategPageComponent } from './categ-page.component';

describe('CategPageComponent', () => {
  let component: CategPageComponent;
  let fixture: ComponentFixture<CategPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategPageComponent]
    });
    fixture = TestBed.createComponent(CategPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
