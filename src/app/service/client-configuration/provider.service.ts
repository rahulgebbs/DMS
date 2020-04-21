import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { environment } from '../../../environments/environment';
import { map, filter } from 'rxjs/operators';
import { Token } from '../../manager/token';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  TokenCls;

  constructor(private http: Http,private router: Router) {
    this.TokenCls = new Token(this.router);
   }

  getProvider(id) {
    //add api here
   // return this.http.get(environment.ApiUrl + '/api/formula-lookup/client/' + id,  { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }

  getProviderList(accessToken, id) {
    let headers: any = new Headers({
      'Access_Token': accessToken
    });
    return this.http.get(environment.ApiUrl + '/api/provider/client/' + id, { headers: headers })

  }

  updateProvider(updateRow){
    return this.http.put(environment.ApiUrl + '/api/provider-master-update', updateRow, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }

getProviders(client_id,row_id){
  return this.http.get(environment.ApiUrl + '/api/provider-master-update/'+ client_id + '/' + row_id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
}

  uploadMaster(accessToken, data) {
    let headers: any = new Headers({
      'Access_Token': accessToken
    });
    return this.http.post(environment.FileApiUrl + '/api/provider-upload', data, { headers: headers })

  }

  downloadTemplate(accessToken) {
    let headers: any = new Headers({
      'Access_Token': accessToken
    });
    
    return this.http.get(environment.ApiUrl + '/api/provider-download-template', { headers: headers, responseType: ResponseContentType.Blob })
      .pipe(map(res => {

        return {
          filename: 'providerTemplate.xlsx',
          data: res.blob()
        };
      }))

  }


  UploadProviderSignature(accessToken, data) {
    let headers: any = new Headers({
      'Access_Token': accessToken
      
    });
    return this.http.put(environment.FileApiUrl + '/api/upload-provider-signature', data, { headers: headers });
    
  }
}
