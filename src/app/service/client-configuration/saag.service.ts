import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators'
import { Token } from 'src/app/manager/token';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class SaagService {
  TokenCls;
  userData
  token: Token;
  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
    // this.userData = this.token.GetUserData();
  }

  getSaggDetail(id) {


    // headers.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
    return this.http.get(environment.ApiUrl + '/api/saag/client/' + id,{ headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }
  downloadTemplate() {
  
    return this.http.get(environment.ApiUrl + '/api/saag-download-template', { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) , responseType: ResponseContentType.Blob })
      .pipe(map(res => {
        return {
          filename: 'saagTemplate.xlsx',
          data: res.blob()
        };
      }))
  }
  uploadSaag(data) {

   
    return this.http.post(environment.FileApiUrl + '/api/saag-upload', data, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }

  getSaagLookup(id) {

    return this.http.get(environment.ApiUrl + '/api/saag-lookup/client/' + id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }

  getEFM() {
    return this.http.get(environment.ApiUrl +'/api/saag-effectiveness-matrix-lookup',{ headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() })})
  }

 
  addSagg(saag) {
    
    return this.http.post(environment.ApiUrl + '/api/saag', saag, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }

  updateSaag(saag) {
   
    return this.http.put(environment.ApiUrl + '/api/saag', saag,{ headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }

  getAgentSaag(id) {
         
  
    //api/agent-saag/client/{id}
    return this.http.get(environment.ApiUrl + '/api/agent-saag/client/1',{ headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }
}
