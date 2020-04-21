import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http'
import 'rxjs/Rx';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientUserMappingService {

  constructor(private http: Http) { }

  getUserMappingInfo(accessToken) {
    let headers: any = new Headers({
      'Access_Token': accessToken
    });

    return this.http.get(environment.ApiUrl + '/api/ClientUserMappingManagement', { headers: headers }).map(res=>res.json());
  }

}
