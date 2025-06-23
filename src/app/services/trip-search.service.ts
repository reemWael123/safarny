import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface Place {
  placeId: any;
  id: number;
  name: string;
  description: string;
  pictureUrl: string;
  cityId: number;
  category: string;
  tripPlaces: any[];
  price: number;
}

interface City {
  id: number;
  name: string;
  image: string;
  description?: string;
}

interface SearchFilters {
  cities?: string[];
  priceMin?: number;
  priceMax?: number;
  rating?: number;
}

interface Trip {
  cityName: string;
  places: { placeId: number; placeName: string; pictureUrl?: string }[];
  hotels: {
    hotelId: number;
    hotelName: string;
    rating: number;
    pricePerNight: number;
    selected?: boolean;
  }[];
}

interface Hotel {
  hotelId: number;
  hotelName: string;
  rating: number;
  pricePerNight: number;
}

@Injectable({
  providedIn: 'root',
})
export class TripSearchService {
  private apiBaseUrl = 'http://safarny.runasp.net/api';

  constructor(private http: HttpClient) {}

  getCities(): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiBaseUrl}/Trip/cities`);
  }

  getPlaces(cityId: number): Observable<Place[]> {
    let url = `${this.apiBaseUrl}/Trip/places-hotels/${cityId}`;
    return this.http.get<Place[]>(url).pipe(
      map((response: any) => response.touristPlaces),
      catchError((error) => {
        console.error('Error fetching places:', error);
        return of([]);
      })
    );
  }

  getUserTrips(userId: string): Observable<Trip[]> {
    return this.http
      .get<Trip[]>(`${this.apiBaseUrl}/TripCart/view-my-trip?userId=${userId}`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching user trips:', error);
          return of([]);
        })
      );
  }

  getTripDays(
    userId: string
  ): Observable<
    { cityId: number; cityName: string; numberOfPlaces: number; days: number }[]
  > {
    return this.http
      .get<any[]>(`${this.apiBaseUrl}/TripCart/trip-days?userId=${userId}`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching trip days:', error);
          return of([]);
        })
      );
  }

  searchTrips(filters: SearchFilters): Observable<any> {
    const params = new HttpParams({
      fromObject: this.convertFiltersToParams(filters),
    });
    return this.http.get(`${this.apiBaseUrl}/Trip/search`, { params });
  }

  addPlacesToCart(data: {
    userId: string;
    placeIds: number[];
  }): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/TripCart/add-places`, data);
  }

  chooseHotels(
    data: { userId: string; cityId: number; hotelId: number }[]
  ): Observable<any> {
    return this.http
      .post(`${this.apiBaseUrl}/TripCart/choose-hotels`, data)
      .pipe(
        catchError((error) => {
          console.error('Error choosing hotels:', error);
          return of(null);
        })
      );
  }

  analyzeTrip(data: { userId: string; startDate: string }): Observable<any> {
    return this.http
      .post(`${this.apiBaseUrl}/TripCart/analyze-trip`, data)
      .pipe(
        catchError((error) => {
          console.error('Error analyzing trip:', error);
          return of(null);
        })
      );
  }

  getFullTripSummary(userId: string, startDate: string): Observable<any[]> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('startDate', startDate); // Avoid manual encoding
    return this.http
      .get<any[]>(`${this.apiBaseUrl}/TripCart/full-trip-summary`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error fetching full trip summary:', error);
          return of([]);
        })
      );
  }

  getSmartTripSummary(
    userId: string,
    startDate: string,
    confirm: boolean,
    selectedCity: string
  ): Observable<any[]> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('startDate', startDate) // Pass startDate directly
      .set('confirm', confirm.toString())
      .set('selectedCity', selectedCity);
    return this.http
      .get<any[]>(`${this.apiBaseUrl}/TripCart/smart-trip-summary`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error fetching smart trip summary:', error);
          return of([]);
        })
      );
  }

  calculateTripPrice(
    userId: string,
    numberOfPeople: number,
    wantHotelBooking: boolean
  ): Observable<{ totalTripPrice: number; pricePerPerson: number }> {
    return this.http
      .get<{ totalTripPrice: number; pricePerPerson: number }>(
        `${this.apiBaseUrl}/TripCart/calculate-trip-price?userId=${userId}&numberOfPeople=${numberOfPeople}&wantHotelBooking=${wantHotelBooking}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error calculating trip price:', error);
          return of({ totalTripPrice: 0, pricePerPerson: 0 });
        })
      );
  }

  getAllHotels(cityId: number): Observable<Hotel[]> {
    return this.http
      .get<Hotel[]>(`${this.apiBaseUrl}/TripCart/all-hotels?cityId=${cityId}`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching all hotels:', error);
          return of([]);
        })
      );
  }

  private convertFiltersToParams(filters: SearchFilters): any {
    const params: any = {};
    if (filters.cities && filters.cities.length > 0) {
      params.cities = filters.cities.join(',');
    }
    if (filters.priceMin !== undefined) {
      params.priceMin = filters.priceMin.toString();
    }
    if (filters.priceMax !== undefined) {
      params.priceMax = filters.priceMax.toString();
    }
    if (filters.rating) {
      params.rating = filters.rating.toString();
    }
    return params;
  }
}
