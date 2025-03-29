// booking.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BookingRequest {
  username: string;
  email: string;
  hotelId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfPersons: number;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'http://safarny.runasp.net/api/hotel-bookings/create';

  constructor(private http: HttpClient) {}

  createBooking(bookingData: BookingRequest): Observable<any> {
    return this.http.post(this.apiUrl, bookingData);
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
}
