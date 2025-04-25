// booking-modal.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BookingRequest,
  BookingService,
} from 'src/app/services/booking.service';

@Component({
  selector: 'app-booking-modal',
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.scss'],
})
export class BookingModalComponent implements OnInit {
  @Input() hotelId: number = 0;
  @Input() roomId: number = 0;
  @Input() roomType: string = '';
  @Input() maxCapacity: number = 1;
  @Input() pricePerNight: number = 0;

  @Output() close = new EventEmitter<void>();
  @Output() bookingComplete = new EventEmitter<any>();

  bookingForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  minDate = new Date().toISOString().split('T')[0]; // Today
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    .toISOString()
    .split('T')[0]; // One year from today

  constructor(private fb: FormBuilder, private bookingService: BookingService) {
    this.bookingForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      checkInDate: [this.minDate, [Validators.required]],
      checkOutDate: ['', [Validators.required]],
      numberOfPersons: [
        1,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(this.maxCapacity),
        ],
      ],
    });
  }

  ngOnInit(): void {
    // Set default checkout date to the day after check-in
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.bookingForm.patchValue({
      checkOutDate: tomorrow.toISOString().split('T')[0],
    });

    // Update max persons when maxCapacity changes
    this.bookingForm
      .get('numberOfPersons')
      ?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(this.maxCapacity),
      ]);
  }

  // booking-modal.component.ts - Update onSubmit method
  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.markFormGroupTouched(this.bookingForm);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const bookingData: BookingRequest = {
      ...this.bookingForm.value,
      hotelId: this.hotelId,
      roomId: this.roomId,
      checkInDate: new Date(this.bookingForm.value.checkInDate).toISOString(),
      checkOutDate: new Date(this.bookingForm.value.checkOutDate).toISOString(),
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: (response) => {
        console.log(response);

        this.isSubmitting = false;
        if (response.ok && response.body.bookingId) {
          // Close the modal and navigate to confirmation page
          this.close.emit(); // Close the modal first

          this.bookingService.navigateToConfirmation(response.body.bookingId);
        } else {
          this.errorMessage = 'Failed to create booking. Please try again.';
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage =
          error.message || 'Failed to create booking. Please try again.';
        console.error('Booking error:', error);
      },
    });
  }

  onCheckInDateChange(): void {
    const checkInDate = new Date(this.bookingForm.value.checkInDate);
    const checkOutDate = new Date(this.bookingForm.value.checkOutDate);

    // If checkout date is before check-in date, set it to the day after check-in
    if (checkOutDate <= checkInDate) {
      const newCheckOutDate = new Date(checkInDate);
      newCheckOutDate.setDate(newCheckOutDate.getDate() + 1);
      this.bookingForm.patchValue({
        checkOutDate: newCheckOutDate.toISOString().split('T')[0],
      });
    }
  }

  calculateTotalPrice(): number {
    if (
      !this.bookingForm.value.checkInDate ||
      !this.bookingForm.value.checkOutDate
    ) {
      return 0;
    }

    const checkIn = new Date(this.bookingForm.value.checkInDate);
    const checkOut = new Date(this.bookingForm.value.checkOutDate);
    const nights = Math.max(
      1,
      Math.floor(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
      )
    );

    return nights * this.pricePerNight;
  }

  closeModal(): void {
    this.close.emit();
  }

  // Helper to mark all controls as touched to trigger validation display
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
