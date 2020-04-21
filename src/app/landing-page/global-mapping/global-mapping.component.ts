import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common-service';
import { Token } from 'src/app/manager/token';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { ClientInsuranceService } from 'src/app/service/client-insurance.service';
import { GlobalInsuranceService } from 'src/app/service/global-insurance.service';
import { ModalData } from './mapping-modal/mapping-modal.component';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { dropDownFields } from 'src/app/manager/dropdown-feilds';

@Component({
  selector: 'app-global-mapping',
  templateUrl: './global-mapping.component.html',
  styleUrls: ['./global-mapping.component.css'],
  providers: [dropDownFields]
})
export class GlobalMappingComponent implements OnInit {
  Title = "Global Insurance Mapping";
  UserId;
  ClientId;
  ClientInsuranceId;
  GlobalInsuranceId = 0;
  ClientList: any[] = [];
  DisableClientList = false;
  DisableInsuranceSearch = false;
  // DisableClientInsurance = true;
  DisableGlobalInsurance = true;
  HideAllData = true;
  DisplayModal = false;
  ShowAddButton = false;
  ClientRows = [];
  GLobalRows;
  SelectedClientInsurance = new ModalData();
  SelectedGlobalInsurance = new ModalData();
  RowSelection = "single";
  GGridApi;
  CGgridApi;
  ResponseHelper;
  GlobalHeaders;
  select;
  testForm: FormGroup;
  CommonHeaders = [
    { field: "Id", hide: true, rowGroupIndex: null },
    {
      headerName: "Practice Name", field: "Practice_Name"
    },
    {
      headerName: "Payer Name", field: "Payer_Name"
    },
    {
      headerName: "Global Insurance Added", field: "Global_Insurance_Added"
    },
    {
      headerName: "Timely Filing Limits in Days", field: "Timely_Filing_Limits_in_Days"
    },
    {
      headerName: "Contact_Number", field: "Contact_Number"
    },
    {
      headerName: "Website", field: "Website"
    },
    {
      headerName: "Start Time", field: "Start_Time"
    },
    {
      headerName: "Claim Mailing Address", field: "Claim_Mailing_Address"
    },
    {
      headerName: "Appeal Mailing Address", field: "Appeal_Mailing_Address"
    },
    {
      headerName: "End Time", field: "End_Time"
    },
    {
      headerName: "Appeal Filing Limit In Days", field: "Appeal_Filing_Limit_In_Days"
    },
    {
      headerName: "Financial Class", field: "Financial_Class"
    },
    {
      headerName: "Appeal Mailing Address 1", field: "Appeal_Mailing_Address1"
    },
    {
      headerName: "Appeal Mailing Address 2", field: "Appeal_Mailing_Address2"
    },
    {
      headerName: "Appeal Mailing City", field: "Appeal_Mailing_City"
    },
    {
      headerName: "Appeal Mailing State", field: "Appeal_Mailing_State"
    },
    {
      headerName: "Appeal Mailing Zipcode", field: "Appeal_Mailing_Zipcode"
    },
    {
      headerName: "Claim Mailing Address 1", field: "Claim_Mailing_Address1"
    },
    {
      headerName: "Claim Mailing Address 2", field: "Claim_Mailing_Address2"
    },
    {
      headerName: "Claim Mailing City", field: "Claim_Mailing_City"
    },
    {
      headerName: "Claim Mailing State", field: "Claim_Mailing_State"
    },
    {
      headerName: "Claim Mailing Zipcode", field: "Claim_Mailing_Zipcode"
    },
    {
      headerName: "Fax No", field: "Fax_No"
    },
    {
      headerName: "Insurance Name Gebbs", field: "Insurance_Name_Gebbs"
    },
    {
      headerName: "Appeal Mailing FaxNo", field: "Appeal_Mailing_FaxNo"
    },
    {
      headerName: "Claim Mailing FaxNo", field: "Claim_Mailing_FaxNo"
    },
    {
      headerName: "Appeal Mailing ContactNo", field: "Appeal_Mailing_ContactNo"

    },
    {
      headerName: "Claim Mailing ContactNo", field: "Claim_Mailing_ContactNo"
    },
    {
      headerName: "Insurance Name For Appeal", field: "Insurance_Name_for_Appeal"
    },
    {
      headerName: "Insurance Name For Mail", field: "Insurance_Name_for_Mail"
    },
    {
      headerName: "Insurance Code", field: "Insurance_Code"
    },
    {
      headerName: "Insurance State", field: "Insurance_State"
    },
    {
      headerName: "Is IVR", field: "Is_IVR"
    },
    {
      headerName: "Is Voice", field: "Is_Voice"
    },
    {
      headerName: "Email Id", field: "Email_Id"
    },
    {
      headerName: "CSR Fax", field: "CSR_Fax"
    },
    {
      headerName: "Attention To", field: "Attention_To"
    },
  ];


  constructor(private selectedFields: dropDownFields, private fb: FormBuilder, private commonservice: CommonService, private clientservice: ClientInsuranceService, private globalservice: GlobalInsuranceService, private router: Router, private notificationservice: NotificationService) {
    this.testForm = this.fb.group({
      "Client_Id": [""],
    })
  }

  ngOnInit() {
    let objCopy = JSON.parse(JSON.stringify(this.CommonHeaders));
    objCopy.splice(3, 1)
    this.GlobalHeaders = objCopy;
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    var token = new Token(this.router);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.ClientList = this.selectedFields.setSelected(userdata.Clients);
    if(this.ClientList[0].selected){
      this.ClientId = this.ClientList[0].Id
      this.SelectedClientInsurance.Client_Id = this.ClientList[0].Client_Id
      //this.InstructionModel.Client_Id = data[0].Id;
      this.GetAllDetails(this.SelectedClientInsurance.Client_Id)
    }else{
      this.DisableInsuranceSearch = true
    }
    this.selectedValue(this.ClientList)
    // this.GetClientList();
    this.GetGlobalInsuranceList();
  }

  selectedValue(data) {

    if (data.length == 1 && data.length) {

      data[0].selected = true;
      this.ClientId = data[0].Id
      this.SelectedClientInsurance.Client_Id = data[0].Client_Id
      //this.InstructionModel.Client_Id = data[0].Id;
      this.GetAllDetails(this.SelectedClientInsurance.Client_Id)
      //this.GetClientInsuranceList();

    } else {
      this.DisableInsuranceSearch = true
    }
  }


  ToggleModal(event) {
    this.DisplayModal = false;
  }

  OnClientGridReady(event) {
    this.CGgridApi = event.api;
  }

  OnGlobalGridReady(event) {
    this.GGridApi = event.api;
  }

  autoSizeCGrid(event) {
    if (this.ClientRows != null) {
      var allColumnIds = [];
      event.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
      });
      event.columnApi.autoSizeColumns(allColumnIds);
    }
    // }
  }

  autoSizeGGrid(event) {
    if (this.GLobalRows != null) {
      var allColumnIds = [];
      event.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
      });
      event.columnApi.autoSizeColumns(allColumnIds);
    }
  }

  OnClientRowClicked(event) {
    this.DisplayModal = false;
    this.ShowAddButton = true;
    // this.DisableGlobalInsurance = false;
    this.ClientInsuranceId = event.data.Id;
    this.ClientId = event.data.Client_Id;
    this.GetClientData();
    // this.DisplayModal = true;

  }

  onRowSelected(event) {
    this.GGridApi = event.api;
  }

  OnGlobalRowClicked(event) {
    this.DisplayModal = false;
    this.GlobalInsuranceId = event.data.Id;
    this.GetGlobalData();
    if (this.SelectedClientInsurance.Payer_Name != "") {
      this.DisplayModal = true;
    }
  }

  ClientListOnChange(event) {
    this.ShowAddButton = false;
    this.ClientRows = [];
    this.HideAllData = true;
    // this.DisableClientInsurance = true;
    // this.DisableGlobalInsurance = true;
    if (!event.target.value || event.target.value == "") {
      this.DisableInsuranceSearch = true;
    }
    else {
      this.ClientId = event.target.value;
      this.DisableInsuranceSearch = false;
    }
  }

  GetAllDetails(clientid) {

    this.DisableInsuranceSearch = true;
    this.ClientId = clientid;
    if (this.GGridApi != null) {
      this.GGridApi.deselectAll();
    }
    if (this.CGgridApi != null) {
      this.CGgridApi.showLoadingOverlay();
    }

    this.SelectedClientInsurance = new ModalData();
    this.SelectedGlobalInsurance = new ModalData();
    this.DisableClientList = true;

    this.DisableGlobalInsurance = false;

    // this.selectedValue(this.ClientId)
    this.GetClientInsuranceList();
  }

  GetClientInsuranceList() {
    this.HideAllData = false;
    this.clientservice.GetMasterList(this.ClientId).pipe(finalize(() => {
      if (this.CGgridApi != null) {
        this.CGgridApi.hideOverlay();
      }
      this.DisableClientList = false;
      this.DisableInsuranceSearch = false;
    })).subscribe(
      data => {
        this.ClientRows = data.json().Data;
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
        this.ClientRows = [];
      }
    )
  }

  GetGlobalInsuranceList() {
    this.globalservice.GetMasterList().pipe(finalize(() => {
      if (this.GGridApi != null) {
        this.GGridApi.hideOverlay();
      }
    })).subscribe(
      res => {
        this.GLobalRows = res.json().Data;
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err)
      }
    )
  }

  AddNewGlobalInsurance() {
    if (this.SelectedClientInsurance.Payer_Name != "") {
      this.GlobalInsuranceId = 0;
      this.SelectedGlobalInsurance = new ModalData();
      this.SelectedGlobalInsurance.Id = 0;
      this.SelectedGlobalInsurance.Client_Id = this.ClientId;
      this.SelectedGlobalInsurance.Client_Insurance_Id = this.ClientInsuranceId;
      this.GGridApi.deselectAll();
      this.DisplayModal = true;
    }
  }

  GetClientData(): any {
    this.clientservice.GetClientInsurance(this.ClientInsuranceId, this.ClientId).subscribe(
      data => {
        this.SelectedClientInsurance = data.json().Data;
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err)
      }
    );
  }
  GetGlobalData(): any {
    this.globalservice.GetGlobalInsurance(this.GlobalInsuranceId).subscribe(
      data => {
        // this.ResponseHelper.GetSuccessResponse(data, data.json())
        this.SelectedGlobalInsurance = data.json().Data;
        this.SelectedGlobalInsurance.Client_Insurance_Id = this.ClientInsuranceId;
        this.SelectedGlobalInsurance.Client_Id = this.ClientId;
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err)
      }
    );
  }

  RefreshOnMap(event) {
    if (this.GGridApi != null) {
      this.GGridApi.showLoadingOverlay();
    }
    if (this.CGgridApi != null) {
      this.CGgridApi.showLoadingOverlay();
    }
    this.ShowAddButton = false;
    this.SelectedClientInsurance = new ModalData();
    this.GetClientInsuranceList();
    this.GetGlobalInsuranceList();
  }


}
