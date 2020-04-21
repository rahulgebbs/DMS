import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Http, Headers } from '@angular/http';
import { Token } from '../manager/token';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CitraserviceService {
  TokenCls
  constructor(private http: Http, private router: Router) {

    this.TokenCls = new Token(this.router);
  }

  GetBucketsWithCount(filter, ClientId: number): any {
    return this.http.get(environment.ApiUrl + '/api/citra-audit/client/' + ClientId + '/' + filter, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetAllFields(clientId, inventoryid, inventoryLogId, bucket_Name): any {
    return this.http.get(environment.ApiUrl + '/api/citra-audit/' + clientId + '/' + inventoryid + '/' + inventoryLogId + '/?bucket_Name=' + bucket_Name, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetAccountList(client_id, bucket_name): any {

    return this.http.get(environment.ApiUrl + '/api/agent-account/' + client_id + '/?bucket_Name=' + bucket_name, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  SaveAllFields(formobj): any {
    return this.http.put(environment.ApiUrl + '/api/citra-fields', formobj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

}
