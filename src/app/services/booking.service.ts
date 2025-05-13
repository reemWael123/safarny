import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
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

export interface TripBookingRequest {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface BookingResponse {
  bookingId: string;
  success: boolean;
  totalPrice: number;
  message?: string;
}

export interface PaymentRequest {
  bookingId: number;
}

export interface TripPaymentRequest {
  bookingId: number;
}

export interface TripPaymentResponse {
  paymentUrl: string;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private bookingApiUrl = 'http://safarny.runasp.net/api/hotel-bookings/create';
  private paymentApiUrl = 'http://safarny.runasp.net/api/hotel-payments/pay';
  private tripBookingApiUrl =
    'http://safarny.runasp.net/api/TripCart/book-trip';
  private tripPaymentApiUrl = 'http://safarny.runasp.net/api/trip-payments/pay';

  constructor(private http: HttpClient, private router: Router) {}

  createBooking(bookingData: BookingRequest): Observable<HttpResponse<any>> {
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

  bookTrip(
    bookingData: TripBookingRequest
  ): Observable<HttpResponse<BookingResponse>> {
    return this.http.post<BookingResponse>(
      this.tripBookingApiUrl,
      bookingData,
      {
        observe: 'response',
      }
    );
  }

  processTripPayment(
    paymentData: TripPaymentRequest
  ): Observable<HttpResponse<TripPaymentResponse>> {
    return this.http.post<TripPaymentResponse>(
      this.tripPaymentApiUrl,
      paymentData,
      {
        observe: 'response',
      }
    );
  }

  navigateToConfirmation(bookingId: string): void {
    this.router.navigate(['/dashboard/home/booking-confirmation', bookingId]);
  }
}
