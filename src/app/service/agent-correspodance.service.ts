import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';


@Injectable({
  providedIn: 'root'
})
export class AgentCorrespodanceService {

  TokenCls

    constructor(private http: Http, private router: Router) {
        this.TokenCls = new Token(this.router);
    }

    GetAllFields(id): any {
    return this.http.get(environment.ApiUrl + '/api/correspondence-entry/Client/' + id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });

    }

    getSaagLookup(id) {

      return this.http.get(environment.ApiUrl + '/api/correspondence-entry-SAAG/Client/' + id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
   
    }

    SaveAllFields(formobj): any {
     return this.http.post(environment.ApiUrl + '/api/correspondence-entry', formobj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
     
    }
}
