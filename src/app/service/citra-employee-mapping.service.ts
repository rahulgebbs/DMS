import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Http, Headers } from '@angular/http';
import { Token } from '../manager/token';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CitraEmployeeMappingService {
  TokenCls
  constructor(private http: Http, private router: Router) {

    this.TokenCls = new Token(this.router);
  }

  GetClientList(Id) {

    return this.http.get(environment.ApiUrl + '/api/client-lookup/' + Id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });

  }

  GetConfigDetailsList(Id) {

    return this.http.get(environment.ApiUrl + '/api/citra-employee-mapping', { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });

  }

  GetConfigDetailsListById(id) {
    var type = '1'
    return this.http.get(environment.ApiUrl + '/api/citra-employee-mapping/' + id + '/' + type, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });

  }

  GetSupervisorListbyclientid(Id) {
    return this.http.get(environment.ApiUrl + '/api/citra-employee-mapping/' + Id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  saveUser(obj, token) {
    let headers: any = new Headers({
      'Content-Type': 'application/json',
      'Access_Token': token
    });

    return this.http.post(environment.ApiUrl + '/api/citra-employee-mapping', obj, { headers: headers })
  }

  UpdateUser(obj, token) {
    let headers: any = new Headers({
      'Content-Type': 'application/json',
      'Access_Token': token
    });

    return this.http.put(environment.ApiUrl + '/api/citra-employee-mapping', obj, { headers: headers })
  }
}
