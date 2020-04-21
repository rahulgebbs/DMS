import { Injectable } from '@angular/core';
import { Token } from 'src/app/manager/token';  
import { Http, Headers } from '@angular/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  Token;
  TokenCls: Token = new Token(this.router);

  constructor(private http: Http, private router: Router) { }

 
  ReferenceFileUpload(file: any): any {
    return this.http.post(environment.FileApiUrl + '/api/reference-document-upload', file, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetAllReferenceFile(file:any):any {
 // return this.http.get(environment.ApiUrl + '/api/reference-document' ,{ headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  return this.http.post(environment.ApiUrl + '/api/reference-document/' , file , { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });

}
}
