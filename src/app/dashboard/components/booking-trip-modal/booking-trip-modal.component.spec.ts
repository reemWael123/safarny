import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingTripModalComponent } from './booking-trip-modal.component';

describe('BookingTripModalComponent', () => {
  let component: BookingTripModalComponent;
  let fixture: ComponentFixture<BookingTripModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingTripModalComponent]
    });
    fixture = TestBed.createComponent(BookingTripModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
