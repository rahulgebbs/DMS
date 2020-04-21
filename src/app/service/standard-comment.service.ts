import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';

@Injectable({
  providedIn: 'root'
})
export class StandardCommentService {
  Token;
  TokenCls: Token = new Token(this.router);

  constructor(private http: Http, private router: Router) { }

   AddStandardComment(formobj) {
    return this.http.post(environment.ApiUrl + '/api/insert-standard-comment', formobj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }
  
    GetAllStandardComment(client_Id: any): any {
      return this.http.get(environment.ApiUrl + '/api/get-all-standard-comment/' + client_Id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
      }
  
   GetSelectedStandardComment(client_Id:number,id:number){
    return this.http.get(environment.ApiUrl + '/api/get-standard-comment/' + client_Id+ '/' + id ,  { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
   }
  
   UpdateStandardComment(obj:any){
   return this.http.put(environment.ApiUrl + '/api/update-standard-comment', obj,{ headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
   }
}
