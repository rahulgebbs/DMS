import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';

@Injectable({
    providedIn: 'root'
})
export class GlobalMappingService {
    TokenCls;
    constructor(private http: Http, private router: Router) {
        this.TokenCls = new Token(this.router);
    }

    InsertMapping(SelectedGlobal): any {
        return this.http.post(environment.ApiUrl + '/api/global-insurance-mapping', SelectedGlobal, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }
    UpdateMapping(SelectedGlobal): any {
        return this.http.put(environment.ApiUrl + '/api/global-insurance-mapping', SelectedGlobal, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }
}