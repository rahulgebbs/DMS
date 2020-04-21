import { Injectable } from '@angular/core';
import { Http, Headers,ResponseContentType  } from '@angular/http';
import { environment } from '../../environments/environment';
import { Token } from '../manager/token';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  TokenCls: Token

  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
  }

  getUserList(token) {
    let headers: any = new Headers({
      'Access_Token': token
    });
    return this.http.get(environment.ApiUrl + '/api/user', { headers: headers });
  }

  getUser(token, id) {
    let headers: any = new Headers({
      'Access_Token': token
    });
    return this.http.get(environment.ApiUrl + '/api/user/' + id, { headers: headers });
  }

  getLookUp(token) {
    let headers: any = new Headers({
      'Access_Token': token
    });
    return this.http.get(environment.ApiUrl + '/api/user/lookup', { headers: headers });
  }

  getClientList(token) {
    let headers: any = new Headers({
      'Access_Token': token
    });
    return this.http.get(environment.ApiUrl + '/api/client', { headers: headers });
  }

  saveUser(user, token) {
    // 
    let headers: any = new Headers({
      'Content-Type': 'application/json',
      'Access_Token': token
    });
    return this.http.post(environment.ApiUrl + '/api/user', JSON.stringify(user), { headers: headers });
  }
  updateUser(user, token) {
    let headers: any = new Headers({
      'Content-Type': 'application/json',
      'Access_Token': token
    });
    // console.log('here it is',user)
    // user.Updated_Date ='2018-12-21T17:09:29.213'
    return this.http.put(environment.ApiUrl + '/api/user', user, { headers: headers })
  }

  GetClientUsers(clientId) {
    return this.http.get(environment.ApiUrl + '/api/client-user-lookup/client/' + clientId, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }
   //Upload functionality added on 30-07-2019
   uploadUserData(data) {
    return this.http.post(environment.ApiUrl + '/api/user-data-upload', data, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }
  downloadTemplate() {
    return this.http.get(environment.ApiUrl + '/api/user-download-template', { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }), responseType: ResponseContentType.Blob })
      .pipe(map(res => {
        return {
          filename: 'User_Template.xlsx',
          data: res.blob()
        };
      }))
  }
}
