import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { environment } from '../../environments/environment';
import { Token } from '../manager/token';
import { Router } from '@angular/router';
// import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    TokenCls;

    constructor(private http: Http, private router: Router) {
        this.TokenCls = new Token(this.router);
    }

    GetClientList(formbody): any {
        return this.http.get(environment.ApiUrl + '/api/client-lookup/' + formbody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }

    getUserURILookup() {
        return this.http.get(environment.ApiUrl + '/api/user-url-lookup')
        ////return  this.http.get(environment.ApiUrl + '/api/user-url-lookup')

        // return abc.json().Data

        //  Observable.create(observer => {
        //  })
    }

    GetReferenceFile(filename: any) {
        return this.http.post(environment.FileApiUrl + '/api/approval-file-download', { Reference_File_Name: filename }, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }), responseType: ResponseContentType.Blob })
            .pipe(map(res => {
                return {
                    filename: filename,
                    data: res.blob()
                };
            }));

    }
}