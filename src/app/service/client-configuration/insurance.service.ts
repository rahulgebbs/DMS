import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Token } from '../../manager/token';
import { Router } from '@angular/router';




@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  TokenCls;

  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
  }




  updateClientRow(updateClientRow) {

    return this.http.put(environment.ApiUrl + '/api/client-insurance', updateClientRow, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }


  uploadClientInsuranceData(ClientInsuranceData) {

    return this.http.post(environment.FileApiUrl + '/api/client-insurance-upload', ClientInsuranceData, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }



  getInsuranceData(id) {

    return this.http.get(environment.ApiUrl + '/api/client-insurance/client/' + id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }




  getClientInsuranceInfo(id, clientRowId) {

    return this.http.get(environment.ApiUrl + '/api/client-insurance/client/' + id + '/' + clientRowId, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }




  downloadTemplate() {



    return this.http.get(environment.ApiUrl + '/api/client-insurance-download-template', {
      responseType: ResponseContentType.Blob,
      headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() })
    })
      .pipe(map(res => {
        return {
          filename: 'Client-Insurance-Template' + new Date().getTime() + '.xlsx',
          data: res.blob()
        };
      }))
  }


  addInsurance(insurance) {

    return this.http.post(environment.ApiUrl + '/api/client-insurance', insurance, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  }

  UploadAppealTemplate(data) {

    return this.http.post(environment.FileApiUrl + '/api/insurance-appeal-template-upload', data, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })

  }

  DeleteAppealTemplate(data) {

    return this.http.post(environment.ApiUrl + '/api/insurance-appeal-template-delete', data, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
  
  }

  downloadappealTemplate(data) {

    return this.http.post(environment.ApiUrl + '/api/insurance-appeal-template-download', data, { responseType: ResponseContentType.Blob, headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
   
      .pipe(map(res => {
        return {
          data: res.blob(),
          filename: 'Appeal-Template' + new Date().getTime() + '.pdf',
        };
      }))

  }


  GetUploadedTemplates(insurance_Id, client_Id) {
   
    return this.http.get(environment.ApiUrl + '/api/uploaded-appeal-template/' + insurance_Id + '/' + client_Id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })

  }
}
