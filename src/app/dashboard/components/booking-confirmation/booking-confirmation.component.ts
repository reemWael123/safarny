// booking-confirmation.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  BookingService,
  PaymentRequest,
} from 'src/app/services/booking.service';

interface BookingDetails {
  bookingId: string;
  username: string;
  email: string;
  hotelId: number;
  roomId: number;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfPersons: number;
  totalPrice: number;
}

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.scss'],
})
export class BookingConfirmationComponent implements OnInit {
  bookingDetails: BookingDetails | null = null;
  isLoading = true;
  errorMessage = '';
  paymentProcessing = false;
  paymentSuccess = false;
  paymentError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    // Get booking ID from route params
    const bookingId = this.route.snapshot.paramMap.get('bookingId');

    if (!bookingId) {
      this.errorMessage = 'Booking ID not found';
      this.isLoading = false;
      return;
    }

    // Fetch booking details
    this.fetchBookingDetails(bookingId);
  }

  fetchBookingDetails(bookingId: string): void {
    this.bookingService.getBookingDetails(bookingId).subscribe({
      next: (data) => {
        this.bookingDetails = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          'Failed to load booking details. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching booking details:', error);
      },
    });
  }

  payNow(): void {
    if (!this.bookingDetails) return;

    this.paymentProcessing = true;
    this.paymentError = '';

    const paymentData: PaymentRequest = {
      bookingId: +this.bookingDetails.bookingId,
    };

    this.bookingService.processPayment(paymentData).subscribe({
      next: (response) => {
        this.paymentProcessing = false;
        this.paymentSuccess = true;
        // Redirect to payment success page after delay
        // setTimeout(() => {
        //   this.router.navigate([
        //     '/dashboard/home/payment-success',
        //     this.bookingDetails?.hotelId,
        //   ]);
        // }, 2000);

        console.log('Payment response:', response);
        setTimeout(() => {
          window.open(response.paymentUrl, '_blank');
        }, 2000);
      },
      error: (error) => {
        this.paymentProcessing = false;
        this.paymentError =
          error.message || 'Payment processing failed. Please try again.';
        console.error('Payment error:', error);
      },
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  calculateNights(): number {
    if (!this.bookingDetails) return 0;

    const checkIn = new Date(this.bookingDetails.checkInDate);
    const checkOut = new Date(this.bookingDetails.checkOutDate);
    return Math.floor(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  goBack(): void {
    this.router.navigate([
      'dashboard/home/hotel-rooms',
      this.bookingDetails?.hotelId,
    ]);
  }
}
