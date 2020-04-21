import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExceptionEntryService {
  TokenCls;
  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
   }
   getException(id){
    return this.http.get(environment.ApiUrl + '/api/Add-New-Exception/client/' + id , { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
   }

   submit(data){
    return this.http.post(environment.ApiUrl + '/api/Add-New-Exception',data, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
   }
}
