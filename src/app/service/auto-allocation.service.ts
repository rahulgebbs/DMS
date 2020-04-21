import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';

@Injectable({
    providedIn: 'root'
})
export class AutoAllocationService {
    TokenCls

    constructor(private http: Http, private router: Router) {
        this.TokenCls = new Token(this.router);
    }

    GetAutoQueueAllocation(formbody): any {
        return this.http.get(environment.ApiUrl + '/api/auto-queue-configuration/client/' + formbody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }

    UpdateSettings(value): any {
        return this.http.post(environment.ApiUrl + '/api/auto-queue-configuration-setting', value, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }

    UpdateMatrix(value) {

        return this.http.put(environment.ApiUrl + '/api/auto-queue-configuration-effecticve-matrix', value, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }
}