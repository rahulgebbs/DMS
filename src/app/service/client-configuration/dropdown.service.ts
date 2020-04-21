import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { environment } from '../../../environments/environment';
import { map, filter } from 'rxjs/operators'
import { Token } from '../../manager/token';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  TokenCls;

  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
  }
  getLookup(cid) {

    return this.http.get(environment.ApiUrl + '/api/dropdown-lookup/client/' + cid, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }

  getDropdown(cid, inid) {


    return this.http.get(environment.ApiUrl + '/api/dropdown-value/' + cid + '/' + inid, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }

  getDropdownValue(cid, id) {

    return this.http.get(environment.ApiUrl + '/api/dropdown/' + cid + '/' + id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })

  }

  updateDropDown(data) {

    return this.http.put(environment.ApiUrl + '/api/dropdown', data, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken(), "Content-Type": 'application/json' }) })
  }

  saveDropdown(data) {

    return this.http.post(environment.ApiUrl + '/api/dropdown', data, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }
  downloadTemplate() {

    return this.http.get(environment.ApiUrl + '/api/dropdown-download-template', { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }), responseType: ResponseContentType.Blob })
      .pipe(map(res => {
        return {
          filename: 'dropdownTemplate.xlsx',
          data: res.blob()
        };
      }))
  }
  uploadDropdown(data) {


    return this.http.post(environment.FileApiUrl + '/api/dropdown-upload', data, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }
}
