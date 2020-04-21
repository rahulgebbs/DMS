import { Injectable } from '@angular/core';
import { Http ,Headers} from "@angular/http";
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';

@Injectable({
    providedIn: 'root'
  })
  export class LogoutService {

  Token;
  TokenCls: Token = new Token(this.router);

  constructor(private http: Http, private router: Router) {  
   
  }
    
    Logout(data) {

     return this.http.put(environment.ApiUrl + '/api/logout', data,{ headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
   
    }
  }