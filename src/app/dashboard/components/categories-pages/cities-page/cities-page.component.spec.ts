import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitiesPageComponent } from './cities-page.component';

describe('CitiesPageComponent', () => {
  let component: CitiesPageComponent;
  let fixture: ComponentFixture<CitiesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CitiesPageComponent]
    });
    fixture = TestBed.createComponent(CitiesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
