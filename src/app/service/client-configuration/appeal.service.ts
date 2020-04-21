import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Token } from 'src/app/manager/token';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppealService {
  Token;
  TokenCls: Token = new Token(this.router);
  constructor(private http: Http, private router: Router) { }

  GetAllPlaceholders(clientid) {
    return this.http.get(environment.ApiUrl + '/api/appeal-placeholders/client/' + clientid, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetTableHeaders(clientId) {
    return this.http.get(environment.ApiUrl + '/api/appeal-headers/client/' + clientId, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  InsertPlaceholderMapping(formobj, clientId) {
    return this.http.post(environment.ApiUrl + '/api/appeal-placeholders/client/' + clientId, formobj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }
}
