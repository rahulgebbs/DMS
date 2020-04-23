import { Injectable } from '@angular/core';
import { Token } from 'src/app/manager/token';
import { Http, Headers } from '@angular/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import 'rxjs/Rx';
@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  Token;
  TokenCls: Token = new Token(this.router);

  constructor(private http: Http, private router: Router) { }


  ReferenceFileUpload(file: any): any {
    return this.http.post(environment.FileApiUrl + '/api/document-upload', file, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetAllReferenceFile(): any {
    // return this.http.get(environment.ApiUrl + '/api/reference-document' ,{ headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    return this.http.get(environment.ApiUrl + '/api/get-document-upload/', { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });

  }
  getreadCount(id) {
    return this.http.get(environment.ApiUrl + '/api/get-read-status-document?reference_document_id=' + id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
  }
}
