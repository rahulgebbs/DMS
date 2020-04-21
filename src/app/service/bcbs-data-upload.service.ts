import { Injectable } from '@angular/core';
import { Http, Headers,ResponseContentType } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class BCBSDataUploadService {
  TokenCls;
  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
  }

  bcbsDataUpload(dataobj): any {
    return this.http.post(environment.ApiUrl + '/api/bcbs-assistance-upload-data', dataobj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  downloadbcbsTemplate(){

    return this.http.get(environment.ApiUrl + '/api/bcbs-assistance-download-template', { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) , responseType: ResponseContentType.Blob   })
    .pipe(map(res => {
      return {
        filename: 'BCBSAssistanceTemplate123.xlsx',
        data: res.blob()
      };
    }))
  }
}
