import { Injectable } from '@angular/core';
import { Http, Headers,ResponseContentType } from '@angular/http';
import { Router } from '@angular/router';
import { Token } from '../manager/token';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UnworkedAccountsReportService {
    TokenCls;

  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
  }

  GetAllEmployees(id): any {
    return this.http.get(environment.ApiUrl + '/api/simple-report-employee/client/'+id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

//   ReportDownloadConfig(Clientid) {
//     return this.http.get(environment.ApiUrl + '/api/report-download-config/'+Clientid, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
// }

GetReport(formbody): any {
  return this.http.post(environment.ApiUrl + '/api/unworked-account-report-download/', formbody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) ,
  responseType:ResponseContentType.Blob})
  .pipe(map(res => {
    return {
        filename: 'UnworkedAccountReport.xlsx',
        data: res.blob()
    };
    }))
}


GetReportDownload(formbody):any {
  return this.http.post(environment.ApiUrl + 'unworked-account-report-download/',formbody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) , responseType: ResponseContentType.Blob })
      .pipe(map(res => {
  return {
      filename: 'UnworkedAccountsReport.xlsx',
      data: res.blob()
  };
  }))
}

}
