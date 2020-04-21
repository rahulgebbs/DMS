import { Injectable } from '@angular/core';
import { Http, Headers,ResponseContentType } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ClientInstructionService {
  TokenCls;

  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);

  }

  GetAllLookups(ClientId: any): any {
    return this.http.get(environment.ApiUrl + '/api/client-instructions-lookup/' + ClientId, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetClientInstructions(ClientId) {
    return this.http.get(environment.ApiUrl + '/api/client-instructions/client/' + ClientId, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetSingleClientInstruction(ClientId, InsId) {
    return this.http.get(environment.ApiUrl + '/api/client-instructions/client/' + ClientId + '/' + InsId, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  InsertInstruction(formdata) {
     
    return this.http.post(environment.ApiUrl + '/api/client-instructions', formdata, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  UpdateInstruction(formdata) {
    return this.http.put(environment.ApiUrl + '/api/client-instructions', formdata, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }
  getCountData(ClientId,DataId){
    return this.http.get(environment.ApiUrl+'/api/client-instruction-read-by-agent/client/'+ClientId+'/'+DataId, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }

  InstructionUpload(dataobj): any {
    return this.http.post(environment.ApiUrl + '/api/Client_Instructions_Upload', dataobj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  downLoadTemplate()
  {
    return this.http.get(environment.ApiUrl + '/api/client_instruction_download_template', { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }), responseType: ResponseContentType.Blob })
      .pipe(map(res => {
        return {
          filename: 'InstructionTemplate.xlsx',
          data: res.blob()
        };
      }));
  }

}
