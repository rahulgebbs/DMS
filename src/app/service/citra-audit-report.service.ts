import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { Router } from '@angular/router'
import { Token } from '../manager/token';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class CitraAuditReportService {
  TokenCls
  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);

  }

  GetReport(formbody): any {
    return this.http.post(environment.ApiUrl + '/api/simple-report', formbody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetAllSupervisors(id): any {
    return this.http.get(environment.ApiUrl + '/api/citra-report-supervisor/client/' + id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetReportDownload(formbody): any {
    return this.http.post(environment.ApiUrl + '/api/citra-audit-report-download', formbody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }), responseType: ResponseContentType.Blob })
      .pipe(map(res => {
        return {
          filename: 'CitraAuditReport.xlsx',
          data: res.blob()
        };
      }))
  }

  ReportDownloadConfig(Clientid) {
    return this.http.get(environment.ApiUrl + '/api/report-download-config/' + Clientid, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }
}
