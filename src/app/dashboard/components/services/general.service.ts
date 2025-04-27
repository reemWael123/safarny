import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

interface Room {
  roomId: number;
  hotelId: number;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  isAvailable: boolean;
}

interface Hotel {
  id: number;
  name: string;
  overview: string;
  address: string;
  rate: number;
  startPrice: number;
  features: string[];
  images: string[];
}

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  constructor(private _httpclinet: HttpClient) {}
  getcities(): Observable<any> {
    return this._httpclinet.get(
      'http://safarny.runasp.net/api/Cities/all-cities'
    );
  }
  sendFilter(category: string) {
    return this._httpclinet.get(
      `http://safarny.runasp.net/api/Cities/filter-city?type=${category}`
    );
  }
  private cateSubject = new BehaviorSubject<any[]>([]);
  cate$ = this.cateSubject.asObservable(); // نجعل البيانات قابلة للاستماع من أي Component

  updateCate(newData: any[]) {
    this.cateSubject.next(newData);
  }

  private citiesSubject = new BehaviorSubject<any[]>([]);
  cities$ = this.citiesSubject.asObservable(); // متغير يمكن لأي مكون الاشتراك فيه

  updateCities(newData: any[]) {
    this.citiesSubject.next(newData); // تحديث البيانات
  }

  getPlaces(cityid: number): Observable<any> {
    return this._httpclinet.get(
      `http://safarny.runasp.net/api/TouristPlaces_Rest/all-tourist-places/${cityid}`
    );
  }

  getresturants(cityid: number): Observable<any> {
    return this._httpclinet.get(
      ` http://safarny.runasp.net/api/TouristPlaces_Rest/all-Restaurants/${cityid}`
    );
  }

  getHotels(cityId: number) {
    return this._httpclinet.get(
      `http://safarny.runasp.net/api/Hotels/hotels_of_city/${cityId}`
    );
  }

  searchHotels(query: string): Observable<any> {
    return this._httpclinet.get(
      `http://safarny.runasp.net/api/Search/NormalSearch/Hotels?query=${encodeURIComponent(
        query
      )}`
    );
  }

  getHotelRooms(hotelId: number) {
    return this._httpclinet.get<Room[]>(
      `http://safarny.runasp.net/api/Hotels/get-rooms-by-hotel/${hotelId}`
    );
  }

  searchRooms(query: string): Observable<any> {
    return this._httpclinet.get(
      `http://safarny.runasp.net/api/Search/NormalSearch/Rooms?query=${encodeURIComponent(
        query
      )}`
    );
  }

  getHotelDetails(hotelId: number) {
    return this._httpclinet.get<Hotel>(
      `http://safarny.runasp.net/api/Hotels/hotel-details/${hotelId}`
    );
  }

  getdetails(placeid: number): Observable<any> {
    return this._httpclinet.get(
      `http://safarny.runasp.net/api/Activities/Activities/${placeid}`
    );
  }
  getpackges(): Observable<any> {
    return this._httpclinet.get(
      'http://safarny.runasp.net/api/Packages/All_Packages'
    );
  }

  searchPackages(query: string): Observable<any> {
    return this._httpclinet.get(
      `http://safarny.runasp.net/api/Search/NormalSearch/Packages?query=${encodeURIComponent(
        query
      )}`
    );
  }

  getpackgesdetails(packegeid: number): Observable<any> {
    return this._httpclinet.get(
      `http://safarny.runasp.net/api/Packages/${packegeid}`
    );
  }
  NearbyResturants(id: number): Observable<any> {
    return this._httpclinet.get(
      `http://safarny.runasp.net/api/Activities/GetTouristPlaceDetails/${id}`
    );
  }
  getplacedetails(placeid: number): Observable<any> {
    return this._httpclinet.get(
      `http://safarny.runasp.net/api/TouristPlaces_Rest/tourist-places-details/${placeid}`
    );
  }
  recommendation(ansewrs: object): Observable<any> {
    return this._httpclinet.post(
      'http://safarny.runasp.net/api/UserPreferences/SavePreferences',
      ansewrs
    );
  }
  createBooking(bookingData: any): Observable<any> {
    return this._httpclinet.post(
      'http://safarny.runasp.net/api/bookings/create',
      bookingData
    );
  }

  payment(bookingId: any): Observable<any> {
    return this._httpclinet.post(
      'http://safarny.runasp.net/api/payments/pay',
      bookingId
    );
  }
  recommendedPackages(username: any): Observable<any> {
    return this._httpclinet.get(
      `http://safarny.runasp.net/api/UserPreferences/GetRecommendedPackages/${username}`
    );
  }
  rating(rate: any): Observable<any> {
    return this._httpclinet.post(
      'http://safarny.runasp.net/api/Reviews/Add',
      rate
    );
  }
  filter(type: any, openNow: any): Observable<any> {
    let params = new HttpParams()
      // .append('diningOptions', diningOptions)
      // .append('rate', rate.toString()) // تحويل الرقم لنص
      .append('type', type)
      // .append('priceRange', priceRange)
      .append('openNow', openNow);

    return this._httpclinet.get(
      'http://safarny.runasp.net/api/TouristPlaces_Rest/filter-Restaurants',
      { params }
    );
  }
  TrackUserInteraction(username: any, placeid: any): Observable<any> {
    const url = `http://safarny.runasp.net/api/Recommendation/TrackUserInteraction?username=${username}&touristPlaceId=${placeid}`;
  
    return this._httpclinet.post(url, null); // أو استخدمي {} بدل null
  }
  chatbot(question: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    const body = JSON.stringify(question); 
  
    return this._httpclinet.post('http://safarny.runasp.net/api/Search/ChatWithAI', body, { headers });
  }
  
  
}
