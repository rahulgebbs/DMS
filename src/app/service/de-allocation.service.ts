import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Token } from '../manager/token';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class DeAllocationService {
  TokenCls;

  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
  }



  GetClientList(Id) {
    
    return this.http.get(environment.ApiUrl + '/api/client-lookup/' + Id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });

  }


  GetAgent(Id) { 
    
    return this.http.get(environment.ApiUrl + '/api/agent-lookup/' + Id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });


  }


  GetBucket(Client_Id, Agent_Id) { 
    
    return this.http.get(environment.ApiUrl + '/api/agent-bucket/' + Client_Id + '/' + Agent_Id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  allDeallocate(id) {
    
    return this.http.put(environment.ApiUrl + '/api/supervisor-all-deallocation', id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }

  Deallocate(bucket) { 
    
    return this.http.put(environment.ApiUrl + '/api/supervisor-deallocation', bucket, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }

}
