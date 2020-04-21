import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';

@Injectable({
    providedIn: 'root'
})
export class BucketMappingService {
    TokenCls

    constructor(private http: Http, private router: Router) {
        this.TokenCls = new Token(this.router);
    }

    GetAgentsList(formbody): any {
        return this.http.get(environment.ApiUrl + '/api/agent-bucket/client/' + formbody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }

    GetAllBuckets(): any {
        return this.http.get(environment.ApiUrl + '/api/agent-bucket/bucket/client', { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }

    SaveMappings(data) {
        return this.http.post(environment.ApiUrl + '/api/agent-bucket', data, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }
}