import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Token } from '../../manager/token';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class FormulaService {
  TokenCls;

  constructor(private http: Http,private router: Router) {
    this.TokenCls = new Token(this.router);

   }

  getFormulaLookup(cid) {
    
    return this.http.get(environment.ApiUrl + '/api/formula-lookup/client/' + cid,  { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }
  getSingelFormula(cid, id) {
   
     return this.http.get(environment.ApiUrl+'/api/formula-expression/'+cid+ '/'+ id,  { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }

  getFormulaValues(cid,InId) {
   
    return this.http.get(environment.ApiUrl + '/api/formula-numeric-filed-lookup/client/' + cid+'/'+InId,  { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }
  saveFormula(formula) {
      
  
    return this.http.post(environment.ApiUrl + '/api/formula', formula,  { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }

  updateFormula(formula) {
  
    return this.http.put(environment.ApiUrl + '/api/formula', formula, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }

}
