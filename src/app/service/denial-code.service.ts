import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DenialCodeService {
 
  Token;
  TokenCls: Token = new Token(this.router);

  constructor(private http: Http, private router: Router) {   
   
  }

  SaveAllFields(formobj) {

  return this.http.post(environment.ApiUrl + '/api/insert-denial-code', formobj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetAllDenialCode(client_Id: any): any {
    return this.http.get(environment.ApiUrl + '/api/get-denial-codes/' + client_Id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
   }

 GetSelectedDenialCode(client_Id:number,denial_code_id:number){
  return this.http.get(environment.ApiUrl + '/api/get-denial-code/' + client_Id+ '/' + denial_code_id ,  { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
   }

 UpdateDenialCode(obj:any){
  return this.http.put(environment.ApiUrl + '/api/update-denial-code', obj,{ headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
   }

   downloadTemplate() {
    
    return this.http.get(environment.ApiUrl + '/api/denial-code-download-template', { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) , responseType: ResponseContentType.Blob   })
      .pipe(map(res => {
        return {
          filename: 'denialCodeTemplate.xlsx',
          data: res.blob()
        };
      }))
  }

  uploadDenialCode(data) {
    return this.http.post(environment.ApiUrl + '/api/denial-code-upload-data', data, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }
}

