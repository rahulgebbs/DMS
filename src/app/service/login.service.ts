import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: Http) {
  }

  Login(data: any) {
    return this.http.post(environment.ApiUrl + '/api/Login', data);
  }
  getQRCode(username) {
    return this.http.get(environment.ApiUrl + '/api/GetPair?Username=' + username).map(res => res.json());
  }

  matchOTP(passcode, userId) {
    return this.http.get(environment.ApiUrl + '/api/ValidatePair?pin=' + passcode + '&userid=' + userId).map(res => res.json());
  }
}
