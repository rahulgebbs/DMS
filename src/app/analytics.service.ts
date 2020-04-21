import { Injectable } from '@angular/core';
import * as jwt_decode from "jwt-decode";
import { Http, Headers } from '@angular/http';

import 'rxjs/Rx';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private http: Http) { }


  logEvent(eventName) {
    const token = sessionStorage.getItem('access_token');
    let data = jwt_decode(token);
    const body = {
      "EmpCode": data.Employee_Code,
      "Client_Id": data.Clients[0].Client_Id,
      "Client_Name": data.Clients[0].Client_Name,
      "EventName": eventName,
      "LinkUsed": environment.linkUsed

    }

    // console.log('logEvent body : ', body);
    let headers: any = new Headers({
      'Access_Token': token
    });

    return this.http.post(environment.ApiUrl + '/api/Insert_Login_Logout_Track', body, { headers: headers })
  }

  logOutEvent(eventName) {
    const token = sessionStorage.getItem('access_token');
    let data = jwt_decode(token);
    const body = {
      "EmpCode": data.Employee_Code,
      "Client_Id": data.Clients[0].Client_Id,
      "Client_Name": data.Clients[0].Client_Name,
      "EventName": eventName,
      "LinkUsed": environment.linkUsed

    }

    // console.log('logEvent body : ', body);
    let headers: any = new Headers({
      'Access_Token': token
    });

    return this.http.put(environment.ApiUrl + '/api/Update_Login_Logout_Track', body, { headers: headers })
  }
}
