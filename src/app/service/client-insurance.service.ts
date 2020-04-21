import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';

@Injectable({
  providedIn: 'root'
})
export class ClientInsuranceService {
TokenCls;
  constructor(private http: Http,private router:Router) {
    this.TokenCls = new Token(this.router);
  }

  GetMasterList(data) {
    return this.http.get(environment.ApiUrl + '/api/client-insurance/client/' + data, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() })});
  }

  GetClientInsurance(Id: any, ClientId: any): any {
    return this.http.get(environment.ApiUrl + '/api/client-insurance/client/' + ClientId + '/' + Id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() })});

  }
}