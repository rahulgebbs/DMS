import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { Router } from '@angular/router';
import { Token } from '../manager/token';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientUserApprovalService {
  TokenCls

  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
  }

  GetSummaryAndComments(ClientId: number, fromdate, todate, status) {
    return this.http.get(environment.ApiUrl + '/api/client-user-approval/client/' + ClientId + '?FromDate=' + fromdate + '&ToDate=' + todate + '&Status=' + status, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetAging(clientId, action, FromDate, ToDate, SelectedComment: string) {
    return this.http.get(environment.ApiUrl + '/api/client-user-approval/client/' + clientId + '?status=' + action + '&FromDate=' + FromDate + '&ToDate=' + ToDate + '&comment=' + SelectedComment, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetInventories(ClientId: number, Action: string, FromDate: string, ToDate: string, SelectedComment: string, Ageing_Bucket_Name: any) {
    return this.http.get(environment.ApiUrl + '/api/client-user-approval/client/' + ClientId + '?status=' + Action + '&FromDate=' + FromDate + '&ToDate=' + ToDate + '&comment=' + SelectedComment + '&filter=' + Ageing_Bucket_Name, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  SaveInventories(response) {
    return this.http.post(environment.ApiUrl + '/api/client-user-approval', response, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
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

  ViewCommentHistory(Client_Id: any, Inventory_Id: any) {
    return this.http.get(environment.ApiUrl + '/api/client-user-approval/client/' + Client_Id + '/' + Inventory_Id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

}
