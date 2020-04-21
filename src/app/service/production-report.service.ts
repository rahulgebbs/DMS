import { Injectable } from '@angular/core';
import { Http, Headers,ResponseContentType } from '@angular/http';
import { environment } from '../../environments/environment';
import { Token } from '../manager/token';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ProductionReportService {

  TokenCls;

  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
  }

  GetReportDownload(formbody):any {
  
    return this.http.post(environment.ApiUrl + '/api/production-report',formbody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) , responseType: ResponseContentType.Blob })
      .pipe(map(res => {
        return {
          filename: 'ProductionReport.xlsx',
          data: res.blob()
          
        };
      }))
  }

  GetAllEmployees(id): any {
    return this.http.get(environment.ApiUrl + '/api/production-report-employee/client/'+id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }
}
