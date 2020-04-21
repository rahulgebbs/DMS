import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';

@Injectable({
  providedIn: 'root'
})
export class DataUploadService {
  TokenCls;
  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
  }

  InventoryDataUpload(dataobj): any {
    return this.http.post(environment.FileApiUrl + '/api/inventory-data-upload', dataobj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  downloadInventoryTemplate(id) {
    //  api/inventory-data-upload-download-template/client/{id}
    return this.http.get(environment.ApiUrl + '/api/inventory-data-upload-download-template/client/' + id,
      {
        headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() })
      }
    )
  }
}
