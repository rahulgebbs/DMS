import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { Token } from '../manager/token';
import { environment } from '../../environments/environment';
import {CommonModule} from '@angular/common'

@Injectable({
  providedIn: 'root'
})
export class DeallocationByAgentByBucketService {
  TokenCls;
  constructor(private http: Http, private router: Router) { 
    this.TokenCls = new Token(this.router);
}
GetBucket(client_Id) { 
    
  return this.http.get(environment.ApiUrl + '/api/Get_Deallocate_ByClient/' + client_Id , { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });

}
GetEmployeeNameByBucketAndClient(client_Id)
{
  return this.http.get(environment.ApiUrl+'/api/Get_Employee_By_Client_And_Bucket/'+client_Id,{ headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
}

DeallocateBucketWise(Employee) { 
  
  return this.http.put(environment.ApiUrl + '/api/deallocate_SelectedEmp_by_bucket', Employee, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
}

//code for second component for second option button
GetEmployees(client_Id) { 
  
  return this.http.get(environment.ApiUrl + '/api/Get_Emp_ByClient/' + client_Id , { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });

}


DeallocateEmployeeWise(bucket) { 
  
  return this.http.put(environment.ApiUrl + '/api/deallocate_SelectedBucket_by_Emp', bucket, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
}
}
