import { Injectable } from '@angular/core';
import { Http, Headers,ResponseContentType } from '@angular/http';
import { environment } from '../../environments/environment';
import { Token } from '../manager/token';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SimpleReportService {
  TokenCls;

  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
  }

  GetReport(formbody): any {
    return this.http.post(environment.ApiUrl + '/api/simple-report', formbody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetAllEmployees(id): any {
    return this.http.get(environment.ApiUrl + '/api/simple-report-employee/client/'+id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetReportDownload(formbody):any {
      return this.http.post(environment.ApiUrl + '/api/simple-report-download',formbody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) , responseType: ResponseContentType.Blob })
          .pipe(map(res => {
      return {
          filename: 'SimpleReport.xlsx',
          data: res.blob()
      };
      }))
    }
    
    ReportDownloadConfig(Clientid) {
    return this.http.get(environment.ApiUrl + '/api/report-download-config/'+Clientid, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }
    
}
