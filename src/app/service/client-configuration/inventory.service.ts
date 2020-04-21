import { Injectable } from '@angular/core';
import { Token } from 'src/app/manager/token';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import * as jwt_decode from "jwt-decode";

@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    Token;
    TokenCls: Token = new Token(this.router);
    constructor(private http: Http, private router: Router) { }

    ngOnInit(): void {
        // let tkclass = new Token();
        // this.Token = tkclass.GetToken();
        // headers.append('Access_Token', this.Token);
    }

    GetAllInventory(clientid) {
        return this.http.get(environment.ApiUrl + '/api/client-inventory/client/' + clientid, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }
    InventoryUpload(file: any): any {
        return this.http.post(environment.FileApiUrl + '/api/client-inventory-upload', file, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }

    InsertOrUpdateInventory(InventoryData): any {
        return this.http.post(environment.ApiUrl + '/api/client-inventory', InventoryData, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }

    DownloadTemplate() {
        return this.http.get(environment.ApiUrl + '/api/client-inventory-download-template', { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }), responseType: ResponseContentType.Blob })
            .pipe(map(res => {
                return {
                    filename: 'Inventory_Template.xlsx',
                    data: res.blob()
                };
            }));
    }

    getInventoryDropdownList() {
        // Get_Agent_High_Priority_Field_List
        return this.http.get(environment.ApiUrl + `api/Get_Agent_High_Priority_Field_List`, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
    }

    searchInventory(fieldName, reference,old_Inventory_Log_Id) {
        let userData = jwt_decode(this.TokenCls.GetToken());
        console.log('searchInventory userData : ', userData);
        return this.http.get(environment.ApiUrl + `api/Get_SQ_Bucket_High_Priority_List/${userData.Clients[0].Client_Id}/${fieldName}/${reference}/Special_Queue`, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());;
    }

    searchCallReferenceAccounts(reference,Old_Inventory_Log_Id) {
        let userData = jwt_decode(this.TokenCls.GetToken());
        console.log('searchCallReferenceAccounts userData : ', userData);
        return this.http.get(environment.ApiUrl + `api/Get_Inventory_By_CallReferenceNo?client_Id=${userData.Clients[0].Client_Id}&CallReferenceNo=${reference}&Old_Inventory_Log_Id=`+Old_Inventory_Log_Id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());;
    }

    gethighPriorityFields(inventoryid, inventoryLogId, old_Inventory_Log_Id ,bucket_name) {
        // http://172.30.52.25:1001/api/Get_SQ_Inventory_Details_For_Agent/6033/28/0?bucket_Name=Special_Queue
        let userData = jwt_decode(this.TokenCls.GetToken());
        console.log('searchCallReferenceAccounts userData : ', userData);
        return this.http.get(environment.ApiUrl + `api/Get_SQ_Inventory_Details_For_Agent/${userData.Clients[0].Client_Id}/${inventoryid}/${inventoryLogId}/${old_Inventory_Log_Id}/?bucket_Name=${bucket_name}`, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());;
    }
}