import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';

@Injectable({
    providedIn: 'root'
})
export class GlobalInsuranceService {
    TokenCls;

    constructor(private http: Http, private router: Router) {
        this.TokenCls = new Token(this.router);
    }

    GetInsuranceMaster(formdata): any {
        let headers: any = new Headers({
            'Content-Type': 'application/json',
            'Access_Token': this.TokenCls.GetToken()
          });
          
        return this.http.post(environment.ApiUrl + '/api/agent-insurance-master', formdata, { headers: headers });
    }

    GetMasterList() {
        return this.http.get(environment.ApiUrl + '/api/global-insurance', { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }

    GetGlobalInsurance(GlobalId: any): any {
        return this.http.get(environment.ApiUrl + '/api/global-insurance/' + GlobalId, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }

    UpdateGlobalInsurance(formbody) {
        return this.http.put(environment.ApiUrl + '/api/global-insurance', formbody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }
}
