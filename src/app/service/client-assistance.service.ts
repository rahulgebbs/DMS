import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { Router } from '@angular/router';
import { Token } from '../manager/token';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientAssistanceService {

  TokenCls

  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
  }

  GetSummaryAndStatus(ClientId: number, fromdate, todate, status) {
    return this.http.get(environment.ApiUrl + '/api/tl-approval/client/' + ClientId + '?FromDate=' + fromdate + '&ToDate=' + todate + '&Status=' + status, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetAging(clientId, action, FromDate, ToDate, SelectedStatus: string) {
    return this.http.get(environment.ApiUrl + '/api/tl-approval/client/' + clientId + '?ActionStatus=' + action + '&FromDate=' + FromDate + '&ToDate=' + ToDate + '&StatusName=' + SelectedStatus, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetInventories(ClientId: number, Action: string, FromDate: string, ToDate: string, SelectedStatus: string, Ageing_Bucket_Name: any) {
    return this.http.get(environment.ApiUrl + '/api/tl-approval/client/' + ClientId + '?ActionStatus=' + Action + '&FromDate=' + FromDate + '&ToDate=' + ToDate + '&StatusName=' + SelectedStatus + '&AgeingFilter=' + Ageing_Bucket_Name, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  SaveInventories(response) {
    return this.http.post(environment.ApiUrl + '/api/tl-approval', response, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetCloseSAAG(Client_Id: any) {
    return this.http.get(environment.ApiUrl + '/api/tl-approval/client/' + Client_Id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetReferenceFile(filename: any) {
    return this.http.post(environment.FileApiUrl + '/api/approval-file-download', { Reference_File_Name: filename }, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }), responseType: ResponseContentType.Blob })
      .pipe(map(res => {
        return {
          filename: filename,
          data: res.blob()
        };
      }));

  }
}
