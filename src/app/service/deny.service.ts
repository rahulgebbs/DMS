import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';
@Injectable({
  providedIn: 'root'
})
export class DenyService {
  TokenCls;
  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
   }
  getReport(data) {
    return  this.http.get(environment.ApiUrl + '/api/tl-denied/client/' + data.ClientId  + '?FromDate=' + data.from_date + '&ToDate=' + data.to_date , { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }
  getAppealReport(data) {
    return  this.http.get(environment.ApiUrl + '/api/tl-denied/client/' + data.ClientId  + '?FromDate=' + data.from_date + '&ToDate=' + data.to_date , { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }
}
