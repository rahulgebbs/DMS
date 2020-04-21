import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Token } from '../manager/token';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  TokenCls;

  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
   }

   GetClientList(Id) {
    
    return this.http.get(environment.ApiUrl + '/api/client-lookup/' + Id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });

  }

  GetDashboard(Id){
    
    return this.http.get(environment.ApiUrl + '/api/supervisor-dashboard/client/' + Id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetIMEdits(Id){
    
    return this.http.get(environment.ApiUrl + '/api/supervisor-dashboard-im-edits/client/' + Id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  getAllocated_Accounts(Id){
    
    return this.http.get(environment.ApiUrl + '/api/supervisor-dashboard-im-edits/client/' + Id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

}
