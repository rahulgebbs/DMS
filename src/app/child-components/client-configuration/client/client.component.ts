import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ClientService } from '../../../service/client-configuration/client.service';
import { Token } from '../../../manager/token';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { customValidation } from '../../../manager/customValidators'
import { finalize } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  @Output() next_page = new EventEmitter<any>();
  @Output() messageEvent = new EventEmitter<any>();
  clientData: any = new clientInfo();
  @Input() selectClient;
  @Input() SelectedClientData;
  token: Token;
  userData;
  click: boolean = false
  rowData;
  ResponseHelper;
  addClient: FormGroup;
  validated: boolean = false;
  DB_Name;
  DisableButton = false;
  rowSelection = "single";
  gridApi;
  gridColumnApi;
  spaceValidation: boolean = false;
  valtoremove;
  saveBtnDisable: boolean = true;
  nextBtnDisable: boolean = true;
  clearBtnDisable: boolean = true
  Is_Active: boolean = false;
  clientSelected
  show_Is_Appeal_Processed: boolean = false
  Is_Aging_Report: boolean = false;
  File_Location;
  columnDefs = [
    { headerName: 'ID', field: 'Id', hide: "false" },
    { headerName: 'Client Name', field: 'Client_Name' },
    { headerName: 'Status', field: 'Status' },
  ]
  constructor(private router: Router, private services: ClientService, public fb: FormBuilder, private notificationservice: NotificationService, ) {


    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();
    this.addClient = this.fb.group({
      "Id": [""],
      "Client_Name": ["", Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9\_]*$")])],
      "DB_Server_Name": ["", Validators.compose([Validators.required, Validators.maxLength(100)])],
      "DB_Username": ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      "DB_Name": [""],
      "DB_Password": ["", Validators.compose([Validators.required, Validators.maxLength(30)])],
      "Is_Active": [""],
      "Updated_Date": [""],
      "Is_Aging_Report": [""],
      "Original_Client_Name": ["", Validators.compose([Validators.required])],
      "SubClient_Name": [""],
      "File_Location": ["C:/"
        // , Validators.compose([Validators.required, Validators.maxLength(1000)])
      ],
      //  "Is_Appeal_Processed":[""]
    })
    this.getClientList();
    this.addClient.get('DB_Name').disable();
    console.log('constructor userData : ', this.userData)

  }

  ngOnInit() {

    if (this.SelectedClientData) {

      this.clientData = this.SelectedClientData;
      this.showIsAppealProcessedFun()
    }

    if (this.SelectedClientData.Client_Name == undefined) {
      this.nextBtnDisable = true
      this.clearBtnDisable = true
    } else {
      this.nextBtnDisable = false
      this.clearBtnDisable = false
    }
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }
  private onReady(params) {
    params.api.sizeColumnsToFit();

    //  params.columnApi.autoSizeColumns();
    //  params.api.sizeColumnsToFit();
    params.api.forEachNode(node => node.rowIndex ? 0 : node.setSelected(true));
  }
  getClientList() {
    this.services.getClientAdministrator(this.userData.TokenValue)
      .subscribe(data => {
        let res = data.json()
        for (let i = 0; i < res.Data.length; i++) {
          if (res.Data[i].Is_Active == true) {
            res.Data[i].Status = "Active";
          } else {
            res.Data[i].Status = "De-Active";
          }
        }
        this.rowData = res.Data;
      }, err => {
        this.rowData = []
        this.ResponseHelper.GetFaliureResponse(err)
      });
  }
  showIsAppealProcessedFun() {


    if (this.clientData.isClientSelected && this.clientData.Is_Inventory_Uploaded) {
      this.show_Is_Appeal_Processed = true
      this.addClient.value.Is_Appeal_Processed
      this.addClient.addControl('Is_Appeal_Processed', this.fb.control(''));
      this.addClient.value.Is_Appeal_Processed = this.clientData.Is_Appeal_Processed
      if (this.addClient.value.Is_Appeal_Processed == null || this.addClient.value.Is_Appeal_Processed == undefined) {
        this.addClient.value.Is_Appeal_Processed = false;
        this.addClient.patchValue({ 'Is_Appeal_Processed': false })
      }

    } else {
      this.show_Is_Appeal_Processed = false
      if (this.addClient.contains('Is_Appeal_Processed')) {
        this.addClient.removeControl('Is_Appeal_Processed')

      }
    }
  }



  onCellClicked(e) {

    this.saveBtnDisable = false
    this.clearForm();
    this.clientSelected = true;

    this.validated = false
    this.selectClient = false
    let id = e.data.Id
    this.valtoremove = id
    // this.clientData = e.data;
    this.addClient.get('Client_Name').disable();
    this.addClient.get('DB_Server_Name').disable();
    this.services.getClient(this.userData.TokenValue, id).subscribe(data => {

      this.setDBName(e)

      this.nextBtnDisable = false;
      this.clearBtnDisable = false;
      this.saveBtnDisable = false;
      let res = data.json()

      this.clientData = new clientInfo();
      this.clientData = res.Data;
      this.clientData.isClientSelected = true
      this.showIsAppealProcessedFun()
      this.messageEvent.emit(this.clientData);
    }, err => {
      this.ResponseHelper.GetFaliureResponse(err)
    })
  }

  check() {
    this.click = true;
    this.Is_Active = !this.Is_Active
  }
  submitFrom() {
    console.log('submitForm : ', this.addClient.value);
    this.validated = true;
    this.spaceValidation = customValidation.checkClient(this.addClient.value);
    this.saveBtnDisable = true;
    this.nextBtnDisable = true;
    this.clearBtnDisable = true;
    this.addClient.value.Is_Active

    this.clientData.Is_Active;
    // if(this.SelectedClientData.Id=='undefined'){
    if ((this.addClient.value.Is_Active == null || this.addClient.value.Is_Active == undefined)) {
      this.addClient.value.Is_Active = this.clientData.Is_Active || false
    } else if (this.SelectedClientData.Id != 'undefined' && !this.click && !this.addClient.value.Is_Active) {
      this.addClient.value.Is_Active = this.clientData.Is_Active

    } else if (this.SelectedClientData.Id != 'undefined' && this.addClient.value.Is_Active && this.click) {
      this.addClient.value.Is_Active = !this.clientData.Is_Active || true
    }
    else {
      this.addClient.value.Is_Active = false
    }
    // }else{

    // }


    if (this.addClient.value.Is_Aging_Report == null || this.addClient.value.Is_Aging_Report == undefined) {
      this.addClient.value.Is_Aging_Report = this.clientData.Is_Aging_Report || false
    }
    // if (this.addClient.value.Is_Appeal_Processed == null || this.addClient.value.Is_Appeal_Processed == undefined){
    //   this.addClient.value.Is_Appeal_Processed = this.clientData.Is_Appeal_Processed
    // }

    if (this.addClient.value.Is_Active == undefined) {
      this.addClient.patchValue({ "Is_Active": false })
    }

    if (this.addClient.valid && this.validated && !this.spaceValidation) {
      if (this.addClient.value.Id) {
        this.DisableButton = true;
        this.services.updateClient(this.userData.TokenValue, this.addClient.value).pipe(finalize(() => {
          this.DisableButton = false;
          this.saveBtnDisable = false;
          this.nextBtnDisable = false;
          this.clearBtnDisable = false;
          this.gridApi.deselectAll();
        })).subscribe(data => {
          this.ResponseHelper.GetSuccessResponse(data);
          let res = data.json();
          this.clientData = new clientInfo();
          this.clientData = res.Data;
          //      
          // this.rowData.splice(this.valtoremove, 1, res.Data);
          // this.rowData.splice(this.valtoremove,0,res.Data)
          this.getClientList()
          this.clearForm();
          // this.messageEvent.emit(this.clientData);
          // this.next_page.emit('client');
        }, err => {
          this.ResponseHelper.GetFaliureResponse(err)
        })
      } else {
        this.saveBtnDisable = true;
        this.nextBtnDisable = true;
        this.clearBtnDisable = true;
        this.DisableButton = true;
        this.services.saveClient(this.userData.TokenValue, this.addClient.value).pipe(finalize(() => {
          this.DisableButton = false;
          this.saveBtnDisable = false;
          this.nextBtnDisable = false;
          this.clearBtnDisable = false;
          this.gridApi.deselectAll();
        })).subscribe(data => {
          let res = data.json();
          this.clientData = new clientInfo();
          this.clientData = res.Data;
          this.clearForm();
          // this.messageEvent.emit(this.clientData);
          this.ResponseHelper.GetSuccessResponse(data)
          this.getClientList();
          // this.next_page.emit('client');

        }, err => {
          this.ResponseHelper.GetFaliureResponse(err)
        })
      }
    }

  }

  setDBName(e) {
    if (e.target) {
      this.DB_Name = 'iAR_' + e.target.value
    } else if (e.data.Client_Name) {
      this.DB_Name = 'iAR_' + e.data.Client_Name
    }
    this.saveBtnDisable = false;
    this.clearBtnDisable = false;
    this.nextBtnDisable = true;
    this.spaceValidation = customValidation.checkClient(this.addClient.value);
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit()
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }



  clearForm() {

    this.validated = false;
    this.addClient.get('Client_Name').enable();
    this.addClient.get('DB_Server_Name').enable();
    this.addClient.reset();
    this.addClient.patchValue({ "Is_Aging_Report": null, "File_Location": "C:/" })

    this.clientData = new clientInfo();
    this.messageEvent.emit(this.clientData);
    this.gridApi.deselectAll();
    this.clearBtnDisable = true
    this.nextBtnDisable = true
    this.saveBtnDisable = true

    this.clientSelected = false
    this.showIsAppealProcessedFun()

  }

  nextPage() {

    if (this.clientData.Client_Name) {
      this.selectClient = false
      this.next_page.emit('client');
    } else {
      this.selectClient = true
    }
  }
}

export class clientInfo {
  Id?: string;
  Client_Name?: string;
  DB_Server_Name?: string;
  DB_Username?: string;
  Is_Active?: Boolean;
  Updated_Date?: string;
  DB_Name?: string;
  DB_Password?: string;
  Is_Inventory_Uploaded?: boolean;
  Is_Dropdown_Uploaded?: boolean;
  Is_Formula_Uploaded?: boolean;
  Is_Insurance_Uploaded?: boolean;
  Is_Provider_Uploaded?: boolean;
  Is_Dropdown_Required?: boolean;
  Is_Formula_Required?: boolean;
  Is_Saag_Uploaded?: boolean;
  Is_Aging_Report?: boolean;
  File_Location?: string;
  Is_Appeal_Processed?: boolean;
  isClientSelected?: boolean;
}
