import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';

@Injectable({
  providedIn: 'root'
})
export class AgeingDashboardReportService {
  TokenCls;
  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
  }

  getAllFields(ClientId: any, fromdate, todate): any {
    return this.http.get(environment.ApiUrl + '/api/ageing-report/client/' + ClientId + '?FromDate=' + fromdate + '&ToDate=' + todate, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  getExcel(ClientId: any, fromdate, todate) {
    return this.http.get(environment.ApiUrl + '/api/client-dashboard-export/' + ClientId + '?FromDate=' + fromdate + '&ToDate=' + todate, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }
}
