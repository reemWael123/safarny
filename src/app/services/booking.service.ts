// booking.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface BookingRequest {
  username: string;
  email: string;
  hotelId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfPersons: number;
}

export interface BookingResponse {
  bookingId: string;
  success: boolean;
  totalPrice: number;
}

export interface PaymentRequest {
  bookingId: string;
  bookingType: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private bookingApiUrl = 'http://safarny.runasp.net/api/hotel-bookings/create';
  private paymentApiUrl = 'http://safarny.runasp.net/api/payments/pay';

  constructor(private http: HttpClient, private router: Router) {}

  createBooking(bookingData: BookingRequest): Observable<any> {
    return this.http.post(this.bookingApiUrl, bookingData, {
      observe: 'response',
    });
  }

  cancelBooking(
    bookingId: number,
    bookingData: BookingRequest
  ): Observable<any> {
    return this.http.post(
      `http://safarny.runasp.net/api/bookings/cancel/${bookingId}`,
      bookingData
    );
  }

  getBookingDetails(bookingId: string): Observable<any> {
    return this.http.get(
      `http://safarny.runasp.net/api/hotel-bookings/${bookingId}`
    );
  }

  processPayment(paymentData: PaymentRequest): Observable<any> {
    return this.http.post(this.paymentApiUrl, paymentData);
  }

  // Navigate to the booking confirmation page
  navigateToConfirmation(bookingId: string): void {
    this.router.navigate(['/dashboard/home/booking-confirmation', bookingId]);
  }
}
