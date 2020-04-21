import { Injectable } from '@angular/core';
import { Token } from 'src/app/manager/token';  
import { Http, Headers,ResponseContentType } from '@angular/http';
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


  GetAllReferenceFile(file:any):any{

    return this.http.post(environment.ApiUrl + '/api/reference-document/' , file , { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
   
  }

  downloadDocument(data:any):any  {
   
    return this.http.post(environment.ApiUrl + '/api/reference-document-download', data , { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }), responseType: ResponseContentType.Blob })
      .pipe(map(res => {
        return {         
          data: res.blob()
        };
      }))
  }



}
