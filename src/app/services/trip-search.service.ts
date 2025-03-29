// trip.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface Place {
  id: number;
  name: string;
  description: string;
  pictureUrl: string;
  cityId: number;
  category: string;
  tripPlaces: any[];
  price: number;
}

interface Activity {
  id: number;
  name: string;
  location: string;
  image: string;
  price: number;
  city: string;
}

interface Hotel {
  id: number;
  name: string;
  city: string;
  location: string;
  image: string;
  pricePerNight: number;
  rating: number;
}

interface City {
  id: number;
  name: string;
  image: string;
  description?: string;
}

interface SearchFilters {
  cityId?: number;
  startDate?: string;
  endDate?: string;
  hotelId?: number;
  // Additional client-side filters
  cities?: string[];
  activities?: string[];
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  interests?: string[];
}

interface SearchResult {
  places: Place[];
  activities: Activity[];
  hotels: Hotel[];
}

interface PlacesHotelsResponse {
  id: number;
  name: string | null;
  description: string | null;
  touristPlaces: Place[];
  hotels: Hotel[];
}

interface TripSearchResponse {
  tripId: number;
  cityName: string;
  touristPlaces: TouristPlace[];
  hotel: Hotel;
  startDate: string;
  endDate: string;
}

interface TouristPlace {
  id: number;
  name: string;
  description: string;
  pictureUrl: string;
  cityId: number;
  category: string;
  tripPlaces: any[];
  price: number;
}

interface Hotel {
  id: number;
  name: string;
  rate: number;
  address: string;
  overview: string;
  startPrice: number;
  pictureUrls: string[];
  pictureUrl: string;
  cityId: number;
}

@Injectable({
  providedIn: 'root',
})
export class TripSearchService {
  private apiBaseUrl = 'http://safarny.runasp.net/api/Trip';

  constructor(private http: HttpClient) {}

  getCities(): Observable<City[]> {
    // This is correctly implemented using /cities endpoint
    return this.http.get<City[]>(`${this.apiBaseUrl}/cities`);
  }

  // getPlaces(cityId?: number): Observable<Place[]> {
  //   let url = `${this.apiBaseUrl}/places`;
  //   if (cityId) {
  //     url += `/${cityId}`;
  //   }
  //   return this.http.get<Place[]>(url);
  // }

  getActivities(cityId?: number): Observable<Activity[]> {
    // Using places endpoint with a filter for activities
    let url = `${this.apiBaseUrl}/places`;
    if (cityId) {
      url += `/${cityId}`;
    }
    return this.http
      .get<any[]>(url)
      .pipe(
        map((results) => results.filter((item) => item.type === 'activity'))
      );
  }

  // In trip-search.service.ts

  getPlaces(cityId?: number): Observable<Place[]> {
    return this.http
      .get<PlacesHotelsResponse>(`${this.apiBaseUrl}/places-hotels/${cityId}`)
      .pipe(
        map((response) => response.touristPlaces || []),
        catchError((error) => {
          console.error('Error fetching places:', error);
          return of([]);
        })
      );
  }

  getHotels(cityId?: number): Observable<Hotel[]> {
    return this.http
      .get<PlacesHotelsResponse>(`${this.apiBaseUrl}/places-hotels/${cityId}`)
      .pipe(
        map((response) => response.hotels || []),
        catchError((error) => {
          console.error('Error fetching hotels:', error);
          return of([]);
        })
      );
  }

  getPlacesAndHotels(cityId: number): Observable<PlacesHotelsResponse> {
    return this.http
      .get<PlacesHotelsResponse>(`${this.apiBaseUrl}/places-hotels/${cityId}`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching places and hotels:', error);
          return of({
            id: 0,
            name: null,
            description: null,
            touristPlaces: [],
            hotels: [],
          });
        })
      );
  }

  // Get user's trips
  getUserTrips(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/view-trips/${userId}`).pipe(
      catchError((error) => {
        console.error('Error fetching user trips:', error);
        return of([]);
      })
    );
  }

  getTripIdByPlaceId(placeId: number, userId: string): Observable<string> {
    // This is a placeholder - you might need to first get all trips and then find the one containing the place
    return this.getUserTrips(userId).pipe(
      map((trips) => {
        const trip = trips.find((t) =>
          t.touristPlaces.some((place: any) => place.id === placeId)
        );

        if (trip) {
          return trip.tripId.toString();
        }
        throw new Error('Trip not found for this place');
      })
    );
  }

  searchTrips(filters: SearchFilters): Observable<SearchResult> {
    // Using the search endpoint
    const params = new HttpParams({
      fromObject: this.convertFiltersToParams(filters),
    });

    return this.http.get<SearchResult>(`${this.apiBaseUrl}/search`, { params });
  }

  planTripWithBudget(options: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/plan-with-budget`, options);
  }

  selectPlacesAndActivities(selections: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/select`, selections);
  }

  addToCart(data: any): Observable<any> {
    return this.http.post(
      `http://safarny.runasp.net/api/TripBooking/add-to-cart`,
      data
    );
  }

  resetUserTrips(userId: string): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/reset/${userId}`);
  }

  deleteTrip(tripId: string): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/delete-trip/${tripId}`);
  }

  private convertFiltersToParams(filters: SearchFilters): any {
    const params: any = {};

    if (filters.cities && filters.cities.length > 0) {
      params.cities = filters.cities.join(',');
    }

    if (filters.interests && filters.interests.length > 0) {
      params.interests = filters.interests.join(',');
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
