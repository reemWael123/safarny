import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesResturantsHotelsComponent } from './places-resturants-hotels.component';

describe('PlacesResturantsHotelsComponent', () => {
  let component: PlacesResturantsHotelsComponent;
  let fixture: ComponentFixture<PlacesResturantsHotelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlacesResturantsHotelsComponent]
    });
    fixture = TestBed.createComponent(PlacesResturantsHotelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
