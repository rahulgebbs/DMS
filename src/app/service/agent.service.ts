import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
@Injectable({
    providedIn: 'root'
})
export class AgentService {

    TokenCls

    constructor(private http: Http, private router: Router) {
        this.TokenCls = new Token(this.router);
    }

    GetAllFields(clientId, inventoryid, inventoryLogId, bucket_Name): any {
        return this.http.get(environment.ApiUrl + '/api/agent-fields/' + clientId + '/' + inventoryid + '/' + inventoryLogId + '/?bucket_Name=' + bucket_Name, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }

    GetBucketsWithCount(ClientId: number): any {
        return this.http.get(environment.ApiUrl + '/api/agent-bucket-count/' + ClientId, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }


    getAgentSaag(id) {
        let headers: any = new Headers({
            'Access_Token': this.TokenCls.GetToken()
        });
        return this.http.get(environment.ApiUrl + '/api/agent-saag/client/' + id, { headers: headers });
    }
    getClientUpdate(id) {

        let headers: any = new Headers({
            'Access_Token': this.TokenCls.GetToken()
        });
        return this.http.get(environment.ApiUrl + '/api/agent-client-updates/client/' + id, { headers: headers })
    }

    startBreak(value) {
        let headers: any = new Headers({
            'Access_Token': this.TokenCls.GetToken()
        });
        return this.http.post(environment.ApiUrl + '/api/break-type', value, { headers: headers })
    }

    endBreak(value) {
        let headers: any = new Headers({
            'Access_Token': this.TokenCls.GetToken()
        });
        return this.http.put(environment.ApiUrl + '/api/break-type', value, { headers: headers })
    }


    getMyStat(val) {
        let headers: any = new Headers({
            'Access_Token': this.TokenCls.GetToken()
        });
        return this.http.get(environment.ApiUrl + '/api/agent-stats/client/' + val, { headers: headers })
    }

    GetAccountList(client_id, bucket_name): any {

        return this.http.get(environment.ApiUrl + '/api/agent-account/' + client_id + '/?bucket_Name=' + bucket_name, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }

    SaveAllFields(formobj): any {
        return this.http.put(environment.ApiUrl + '/api/agent-fields', formobj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }

    GetAllTouchedAccounts(clientId): any {
        return this.http.get(environment.ApiUrl + '/api/agent-account/' + clientId, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
    }

    UpdateInventoryTime(formobj: any): any {
        console.log('UpdateInventoryTime formobj : ', formobj)
        return this.http.put(environment.ApiUrl + '/api/agent-time', formobj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }
    updateClientInstruction(data) {
        return this.http.put(environment.ApiUrl + '/api/client-instruction-agent-accept', data, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
    }
    GetCount(cid) {
        return this.http.get(environment.ApiUrl + '/api/agent-client-updates-count/client/' + cid, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })

    }

    GetAllDenialCode(clientId, term: string): Observable<any> {
        return this.http.get(environment.ApiUrl + '/api/denial-code-lookup/client/' + clientId + '/?denial_code_char=' + term, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
            .pipe(
                map(
                    res => {
                        var data = [];
                        data = res.json().Data;
                        return data

                    },
                    err => {
                        return [];
                    }
                )
            );
    }

    GetAllNPIList(ClientId: number, term: any) {
        return this.http.get(environment.ApiUrl + '/api/npi-code-lookup/client/' + ClientId + '/?npi_char=' + term, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
            .pipe(
                map(
                    res => {
                        var data = [];
                        data = res.json().Data;
                        return data

                    },
                    err => {
                        return [];
                    }
                )
            );
    }

    GetDenialDetails(clientId, denial_code) {
        return this.http.get(environment.ApiUrl + '/api/denial-code-details-lookup/client/' + clientId + '/?denial_code=' + denial_code, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
    }

    //fileapi
    CheckUploadedTemplate(ClientId: number, CurrentPayerName: string) {
        return this.http.get(environment.FileApiUrl + '/api/agent-template/client/' + ClientId + '/?payer_name=' + CurrentPayerName, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
    }

    UploadStaticFiles(dataobj) {
        return this.http.post(environment.FileApiUrl + '/api/agent-template-upload', dataobj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
    }

    GeneratePdf(formobj) {
        return this.http.post(environment.FileApiUrl + '/api/agent-template', formobj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
    }

    ReviewMergePdf(formobj) {
        return this.http.post(environment.FileApiUrl + '/api/agent-merge-template', formobj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
    }
    //fileapi ends

    InsertEndTimeOfInventory(formobj) {
        return this.http.post(environment.ApiUrl + '/api/agent-time', formobj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
    }

    ViewCommentHistory(Client_Id: any, Inventory_Id: any) {
        return this.http.get(environment.ApiUrl + '/api/client-approval/client/' + Client_Id + '/' + Inventory_Id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }

    DeleteAppealFile(obj) {
        return this.http.put(environment.FileApiUrl + '/api/agent-template-upload', obj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) })
    }
    getBCBSAssistance() {
        let headers: any = new Headers({
            'Access_Token': this.TokenCls.GetToken()
        });
        return this.http.get(environment.ApiUrl + '/api/bcbs-assistance-data', { headers: headers });
    }

    checkClientUserMappingButtonStatus() {
        let headers: any = new Headers({
            'Access_Token': this.TokenCls.GetToken()
        });
        return this.http.get(environment.ApiUrl + '/api/set_Button_Visibility', { headers: headers }).map(res => res.json());
    }

    addNewLine(clientId,inventoryid,inventoryLogId,bucket_Name) {
        let headers: any = new Headers({
            'Access_Token': this.TokenCls.GetToken()
        });
        // api/Get_Add_New_Line_Inventory_Details_For_Agent/{client_Id}/{inventory_Id}/{inventory_Log_Id}?bucket_Name=Special_Queue
        console.log('addNewLine() service : ');
        return this.http.get(environment.ApiUrl + `api/Get_Add_New_Line_Inventory_Details_For_Agent/${clientId}/${inventoryid}/${inventoryLogId}?bucket_Name=${bucket_Name}`, { headers: headers }).map(res => res.json());
    }

    submitAddNewLine(body)
    {
        return this.http.post(environment.ApiUrl + '/api/Save_Add_New_Line_Inventory_Details_For_Agent', body, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
    }
}