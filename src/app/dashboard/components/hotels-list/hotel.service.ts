import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Hotel {
  id: number;
  name: string;
  pictureUrl: string;
  rate: number;
  cityId: number; // Added to track city
}

export interface City {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private baseUrl = 'http://safarny.runasp.net/api/Hotels/hotels_of_city';
  // Static city mapping (replace with API call if available)
  private cities: City[] = [
    { id: 1, name: 'Cairo' },
    { id: 2, name: 'Alexandria' },
    { id: 3, name: 'Luxor' },
    { id: 4, name: 'Aswan' },
  ];

  constructor(private http: HttpClient) {}

  getCities(): Observable<City[]> {
    // Replace with API call if available, e.g., this.http.get<City[]>('/api/Cities')
    return of(this.cities);
  }

  getAllHotels(): Observable<Hotel[]> {
    const cityIds = [1, 2, 3, 4];
    const requests = cityIds.map((cityId) =>
      this.http.get<Hotel[]>(`${this.baseUrl}/${cityId}`).pipe(
        map((hotels) =>
          hotels.map((hotel) => ({
            ...hotel,
            cityId, // Add cityId to each hotel
          }))
        )
      )
    );

    return forkJoin(requests).pipe(
      map((responses: Hotel[][]) => responses.flat())
    );
  }
}
