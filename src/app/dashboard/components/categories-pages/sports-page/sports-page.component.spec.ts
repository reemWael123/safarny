import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportsPageComponent } from './sports-page.component';

describe('SportsPageComponent', () => {
  let component: SportsPageComponent;
  let fixture: ComponentFixture<SportsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SportsPageComponent]
    });
    fixture = TestBed.createComponent(SportsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
