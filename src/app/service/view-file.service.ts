import { Injectable } from '@angular/core';
import { Token } from 'src/app/manager/token';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { map, filter } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ViewFileService {

  Token;
  TokenCls: Token = new Token(this.router);

  constructor(private http: Http, private router: Router) { }


  GetAllReferenceFile(body): any {
    return this.http.get(environment.ApiUrl + '/api/get-document-by-agentid?client_id=' + body.Client_Id + '&agent_id=' + body.agent_id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  downloadDocument(data: any): any {

    return this.http.post(environment.ApiUrl + '/api/reference-document-download', data, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }), responseType: ResponseContentType.Blob })
      .pipe(map(res => {
        return {
          data: res.blob()
        };
      }))
  }

  getFileURL(body) {
    // const body = { "Display_File_Name": "Akshay_Super.pdf", "Reference_File_Name": "c3ebdadb-b8d3-45f7-a55b-7c5cbb0ce7f4.pdf" }
    return this.http.post(environment.ApiUrl + '/api/view-document', body, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }),responseType: ResponseContentType.Blob })
      .pipe(map(res => {
        return {
          data: res.blob()
        };
      }))
  }

  updateViewCount(body)
  {
    // http://172.30.52.25:1011/api/update-ready-agent
    return this.http.put(environment.ApiUrl + '/api/update-ready-agent',body, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

}
