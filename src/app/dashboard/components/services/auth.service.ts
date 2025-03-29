import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  getProfile() {
    let token: any = localStorage.getItem('userToken');
    let decoded: any = jwtDecode(token);
    console.log(decoded);

    localStorage.setItem('userName', decoded.sub);
    localStorage.setItem('userId', decoded.uid);
  }

  constructor(private _httpclinet: HttpClient) {}
  register(data: any): Observable<any> {
    return this._httpclinet.post(
      'http://safarny.runasp.net/api/Auth/register',
      data
    );
  }
  Onlogin(data: any): Observable<any> {
    return this._httpclinet.post(
      'http://safarny.runasp.net/api/Auth/token',
      data
    );
  }
}
