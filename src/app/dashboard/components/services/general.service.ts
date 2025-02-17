import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GeneralService {

 constructor( private _httpclinet:HttpClient){}
  getcities():Observable<any>{
    return this._httpclinet.get('http://safarny.runasp.net/api/Cities_Places/all-cities')
  } 
  sendFilter(category: string) {
    return this._httpclinet.get(`http://safarny.runasp.net/api/Cities_Places/filter-city?type=${category}`)
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
  
  getPlaces(cityid:number):Observable<any>{
    return this._httpclinet.get(`http://safarny.runasp.net/api/Cities_Places/all-tourist-places/${cityid}`)
  } 
 
  getresturants(cityid:number):Observable<any>{
    return this._httpclinet.get(` http://safarny.runasp.net/api/Cities_Places/all-Restaurants/${cityid}`)
  } 

  getdetails(cityid:number):Observable<any>{
    return this._httpclinet.get(`http://safarny.runasp.net/api/Cities_Places/tourist-places-details/${cityid}`)
  } 
  getpackges():Observable<any>{
    return this._httpclinet.get('http://safarny.runasp.net/api/Packages/All_Packages')
  } 
  getpackgesdetails(packegeid:number):Observable<any>{
    return this._httpclinet.get(`http://safarny.runasp.net/api/Packages/${packegeid}`)
  } 
  
}
