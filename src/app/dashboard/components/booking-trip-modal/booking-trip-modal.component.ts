import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  TripBookingRequest,
  BookingService,
  TripPaymentRequest,
} from 'src/app/services/booking.service';

@Component({
  selector: 'app-booking-trip-modal',
  templateUrl: './booking-trip-modal.component.html',
  styleUrls: ['./booking-trip-modal.component.scss'],
})
export class BookingTripModalComponent {
  @Input() userId: string = '';
  @Input() bookingId: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() bookingComplete = new EventEmitter<string>();

  isValidBookingId: boolean = false;
  bookingData: TripBookingRequest = {
    userId: '',
    fullName: '',
    email: '',
    phoneNumber: '',
  };
  isSubmitting: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.bookingData.userId = this.userId;
    this.isValidBookingId =
      !!this.bookingId && !isNaN(parseInt(this.bookingId, 10));
    if (!this.isValidBookingId) {
      console.warn(`Invalid or missing bookingId: ${this.bookingId}`);
      this.error = 'Booking ID not found. Please try booking again.';
      setTimeout(() => (this.error = null), 5000);
    } else {
      console.log(`Valid bookingId received: ${this.bookingId}`);
    }
    this.cdr.detectChanges();
  }

  submitPayment(): void {
    if (!this.isValidBookingId) {
      this.error = 'Invalid booking ID. Please try booking again.';
      setTimeout(() => (this.error = null), 3000);
      return;
    }

    if (
      !this.bookingData.fullName ||
      !this.bookingData.email ||
      !this.bookingData.phoneNumber
    ) {
      this.error = 'Please fill in all required fields.';
      setTimeout(() => (this.error = null), 3000);
      return;
    }

    this.isSubmitting = true;
    this.error = null;
    this.successMessage = null;

    const paymentData: TripPaymentRequest = {
      bookingId: parseInt(this.bookingId, 10),
    };

    this.bookingService.processTripPayment(paymentData).subscribe({
      next: (response) => {
        this.successMessage = `Payment initiated! Redirecting to payment page...`;
        this.isSubmitting = false;
        this.bookingComplete.emit(this.bookingId);
        setTimeout(() => {
          this.successMessage = null;
          if (response.body?.paymentUrl) {
            window.open(response.body.paymentUrl, '_blank');
          } else {
            this.router.navigate(['/dashboard/home/trip-search']);
            this.close.emit();
          }
        }, 2000);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error processing payment:', err);
        this.error = 'Failed to process payment. Please try again.';
        this.isSubmitting = false;
        setTimeout(() => (this.error = null), 3000);
        this.cdr.detectChanges();
      },
    });
  }

  closeModal(): void {
    this.close.emit();
  }
}
