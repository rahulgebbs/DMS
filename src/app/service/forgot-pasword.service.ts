import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgotPaswordService {

  constructor(private http: Http) { }


  ForgotPassword(formbody) {
    return this.http.post(environment.ApiUrl + '/api/forgot-password', formbody);
  }

  ResetPassword(formbody): any {
    return this.http.post(environment.ApiUrl + '/api/reset-password', formbody);
  }

}
