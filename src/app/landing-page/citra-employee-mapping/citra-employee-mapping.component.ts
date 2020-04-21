import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Token } from '../../manager/token';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { editUserInfo } from 'src/app/manager/field.interface';
import { NotificationService } from 'src/app/service/notification.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { customValidation } from '../../manager/customValidators';
// import { SupervisorDashboardService } from 'src/app/service/supervisor-dashboard.service';
import { CitraEmployeeMappingService } from 'src/app/service/citra-employee-mapping.service';
import { dropDownFields } from 'src/app/manager/dropdown-feilds';


@Component({
  selector: 'app-citra-employee-mapping',
  templateUrl: './citra-employee-mapping.component.html',
  styleUrls: ['./citra-employee-mapping.component.css'],
  providers: [dropDownFields]
})
export class CitraEmployeeMappingComponent implements OnInit {
  title = 'Citra Employee Mapping';

  UserId = 0;
  ClientId = 0;
  configId: 0;

  configdetail: FormGroup;
  citramappingForm: FormGroup;
  dashboard: FormGroup;

  show: boolean = false
  showfields: boolean = false
  validated: boolean = false;
  isChecked: boolean = false;

  rowSelection = "single";
  setClient: any;
  Token: Token;
  userData: any;

  SupervisorList: any[] = [];
  ClientList: any[] = [];
  setFinalSupervisorList: any[] = [];

  ResponseHelper: ResponseHelper;

  Client_Name;
  Supervisor_Name;

  supervisorids;
  gridApi;
  gridColumnApi;

  columnDefs = [
    { headerName: 'ID', field: 'id', hide: "false" },
    { headerName: 'Employee Code', field: 'EmployeeCode' },
    { headerName: 'Supervisor Name', field: 'Full_Name' },
    { headerName: 'Client Name', field: 'Client_Name' },
    { headerName: 'Created By', field: 'Created_By' },
    { headerName: 'Created By Name', field: 'Created_By_Name' },
    { headerName: 'Created On', field: 'CreatedOn' },
    { headerName: 'IsActive', field: 'IsActive', cellRenderer: this.ValCheck },
  ];
  rowData;


  constructor(private selectField: dropDownFields,private citraemployeemappingservice: CitraEmployeeMappingService, private router: Router, private notificationservice: NotificationService, public fb: FormBuilder) {

    this.dashboard = this.fb.group({
      "ClientId": [],
      "Client_Name": [],
      "vals": ""
    });

    this.configdetail = this.fb.group({
      "ClientId": [],
      "Client_Name": [],
      "Supervisor_Name": [],
      "isChecked": []
    });

    this.citramappingForm = this.fb.group({
      "isChecked": []
    });
  }

  ngOnInit() {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    this.Token = new Token(this.router);
    this.userData = this.Token.GetUserData();
    console.log(this.userData);
    console.log(this.ClientId);
    this.dashboard.patchValue({ "Comma_Separated_Clients": this.setClient })
    this.ClientId = this.userData.Clients[0].Client_Id;
    this.UserId = this.userData.UserId;
      //this.ClientList = this.userData.Clients
      this.ClientList = this.selectField.setSelected(this.userData.Clients);
      this.selectedValue(this.ClientList);
console.log(this.ClientList);
    // this.Get_ClientList();
    this.Get_All_Config_Details();
  }



  Get_ClientList() {

    this.citraemployeemappingservice.GetClientList(this.UserId).subscribe(
      data => {
        this.ClientList = data.json().Data;
        console.log(this.ClientList);
        this.selectedValue(this.ClientList)
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    )
  }

  Get_All_Config_Details() {
    this.citraemployeemappingservice.GetConfigDetailsList(this.UserId).subscribe(
      data => {
        this.rowData = data.json().Data.config_Details;
        console.log(data.json().Data);
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    )
  }

  selectedClient() {
    for (let j = 0; j < this.SupervisorList.length; j++) {
      for (let i = 0; i < this.ClientList.length; i++) {
        if (this.SupervisorList[j] == this.ClientList[i].Client_Name) {
          this.SupervisorList[i].checked = true;
          this.SupervisorList[i].old = true
        }
      }
    }
  }

  getFinalSelectedClient() {
    this.setClient = [];
    this.setFinalSupervisorList = [];
    for (let i = 0; i < this.SupervisorList.length; i++) {
      if (this.SupervisorList[i].checked == true) {

        if (this.supervisorids == undefined) {
          this.supervisorids = "," + this.SupervisorList[i].id
        }
        else {
          this.supervisorids = this.supervisorids + "," + this.SupervisorList[i].id
        }
      }
    }
  }

  selectedValue(data) {
    if (data.length == 1 && data.length) {
      data[0].selected = true;
      this.ClientId = data[0].Id
      this.Get_Supervisor_List_By_Client_Id();
      this.show = true;
      this.showfields = false;
    }
    else {

    }
  }

  ValCheck(params) {
    let val
    if (params.value) {
      val = 'Yes'
    } else {
      val = 'No'
    }
    return val;
  }

  onClientChange(e) {
    this.ClientId = e.target.value;
    this.Get_Supervisor_List_By_Client_Id();
    this.show = true;
    this.showfields = false;
  }

  changeCheckbox(i, e) {
    this.SupervisorList[i].checked = !this.SupervisorList[i].checked;
  }

  Get_Supervisor_List_By_Client_Id() {
    this.citraemployeemappingservice.GetSupervisorListbyclientid(this.ClientId).subscribe(
      data => {
        console.log(data.json().Data);
        this.SupervisorList = data.json().Data.supervisorList_Info;
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    )
  }


  SubmitForm() {

    var obj =
    {
      "Id": this.ClientId,
      "SupervisorIds": this.supervisorids
    }

    this.citraemployeemappingservice.saveUser(obj, this.userData.TokenValue).subscribe((data) => {
      this.ResponseHelper.GetSuccessResponse(data)
      //this.Get_ClientList()
      this.Get_All_Config_Details();
      this.setClient = []
      this.SupervisorList = [];
      this.show = false;
      this.showfields = false;
    }, err => {
      this.ResponseHelper.GetFaliureResponse(err)
      this.supervisorids = null
    });

  }

  SubmitForm1() {
    var obj =
    {
      "Id": this.configId,
      "IsActive": this.isChecked
    }

    this.citraemployeemappingservice.UpdateUser(obj, this.userData.TokenValue).subscribe((data) => {
      this.ResponseHelper.GetSuccessResponse(data)
      //this.Get_ClientList()
      this.Get_All_Config_Details();
      this.setClient = []
      this.SupervisorList = [];
      this.show = false;
      this.showfields = false;
    }, err => {

      this.ResponseHelper.GetFaliureResponse(err)
    });

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.columnApi.autoSizeColumns();
  }

  onCellClicked(e) {

    this.citraemployeemappingservice.GetConfigDetailsListById(e.data.id).subscribe((data) => {
      let response = data.json();
      if (response.Message[0].Type == "SUCCESS") {
        this.showfields = true;
        this.show = false;
        this.Client_Name = data.json().Data.config_Details[0].Client_Name;
        this.Supervisor_Name = data.json().Data.config_Details[0].Full_Name;
        this.isChecked = data.json().Data.config_Details[0].IsActive;
        this.configId = data.json().Data.config_Details[0].id;
        // console.log(data.json().Data.config_Details[0].Client_Name);
      }
      else {
        this.ResponseHelper.GetFaliureResponse(data)
      }
    }, err => {
      this.ResponseHelper.GetFaliureResponse(err)
    });
  }

  function(event) {
    if (event.target.checked) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
  }
}
