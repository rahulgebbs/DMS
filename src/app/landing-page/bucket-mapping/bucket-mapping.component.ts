import { Component, OnInit } from '@angular/core';
import { BucketMappingService } from 'src/app/service/bucket-mapping.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common-service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { Token } from 'src/app/manager/token';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { dropDownFields } from 'src/app/manager/dropdown-feilds'

@Component({
  selector: 'app-bucket-mapping',
  templateUrl: './bucket-mapping.component.html',
  styleUrls: ['./bucket-mapping.component.css'],
  providers: [BucketMappingService, dropDownFields]
})
export class BucketMappingComponent implements OnInit {
  Title = "AR Skills Mapping";
  ClientList: any[] = [];
  UserId: number;

  Bucket: FormGroup;
  ClientId;
  AgentId: number;
  DisableClientList: boolean = true;
  DisplayError: boolean = false;
  DisableMap = true;
  RowSelection = "single";
  ResponseHelper;
  DisplayMessage = "Please Select atleast one bucket";
  select: boolean = false
  BucketModel = new BucketModel();


  columnDefs = [
    {
      field: 'Id', hide: true, rowGroupIndex: null
    },
    {
      headerName: 'Name', field: 'Agent_Name',
      autoHeight: true
      , cellStyle: { 'white-space': 'normal' }
    },
    {
      headerName: 'Expertise', field: 'Expertise',
      autoHeight: true
      , cellStyle: { 'white-space': 'normal' }
    },
    {
      headerName: 'Skill Assigned', field: 'Buckets',
      width: 280, autoHeight: true
      , cellStyle: { 'white-space': 'normal' }
    }
  ];
  public gridApi;

  Buckets;
  DisplayBuckets = [];
  rowData = [];
  gridColumnApi: any;

  constructor(private dropDownField: dropDownFields, private fb: FormBuilder, private bucketservice: BucketMappingService, private commonservice: CommonService, private notificationservice: NotificationService, private router: Router) {
    this.Bucket = this.fb.group({
      "Client_Id": [""],
    })
  }

  ngOnInit() {
    let token = new Token(this.router);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    //  this.GetClientList();
    this.ClientList = this.dropDownField.setSelected(userdata.Clients)
    if (this.ClientList[0].selected == true) {
      // data[0].selected = true;
      this.ClientId = this.ClientList[0].Client_Id
      this.GetAgentList()
    }

    // this.selectedValue(this.ClientList)

    this.GetAllBuckets();
    this.ResetBuckets();
  }

  selectedValue(data) {

    if (data.length == 1 && data.length) {

      data[0].selected = true;
      this.ClientId = data[0].Client_Id
      this.GetAgentList()
    } else {
      this.select = true
    }

  }



  ResetBuckets() {

    Object.keys(this.BucketModel)
    let formarr = [];
    var result = Object.entries(this.BucketModel).map(([key, value]) => ({ key, value }));
    this.DisplayBuckets = result;
  }

  ClientListOnChange(event) {
    this.DisableClientList = true
    this.rowData = [];
    this.DisableMap = true;
    this.ResetBuckets();
    if (!event.target.value || event.target.value == "0") {
      this.DisableClientList = true;
    }
    else {
      this.ClientId = event.target.value;
      this.DisableClientList = false;
    }
  }

  GetAgentList() {

    this.DisableClientList = true;
    if (this.rowData) {
      // this.gridApi.resetRowHeights();
    }

    this.bucketservice.GetAgentsList(this.ClientId).pipe(finalize(() => {
      // this.DisableClientList = false;
    })).subscribe(
      data => {

        this.DisableClientList = false;
        this.rowData = data.json().Data;
      },
      err => {
        this.DisableClientList = false;
        this.rowData = [];
        this.ResponseHelper.GetFaliureResponse(err)
      }
    )

  }

  GetAllBuckets() {
    this.Buckets = [];
    this.bucketservice.GetAllBuckets().subscribe(
      data => {
        this.Buckets = data.json().Data;
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    )
  }

  onColumnResized(event) {
    if (event.finished) {
      // this.gridApi.resetRowHeights();
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    setTimeout(function () {
      // params.api.resetRowHeights();
    }, 500);
  }

  MapNow(data) {


    let temparr = data.Buckets.split(", ");
    for (let i = 0; i < temparr.length; i++) {
      this.DisplayBuckets.forEach(e => {
        if (e.key.split("_").join(" ") == temparr[i]) {
          e.value = true;
        }
      })
    }
  }


  OnRowClicked(event) {

    this.DisableMap = false;
    this.AgentId = event.data.Id;
    this.ResetBuckets();
    this.MapNow(event.data);
  }

  SubmitForm() {
    let data: [{ key: string, value: boolean }] = JSON.parse(JSON.stringify(this.DisplayBuckets));
    var result = {};
    for (var i = 0; i < data.length; i++) {
      result[data[i].key] = data[i].value;
    }

    let IsValid = false;

    data.forEach(e => {
      if (e.value == true) {
        IsValid = true;
      }
    })
    this.DisplayError = !IsValid;

    if (!this.DisplayError) {
      this.DisableMap = true;
      let dataobj: any;
      dataobj = result;

      dataobj.User_Id = this.AgentId;
      dataobj.Client_Id = this.ClientId;

      this.bucketservice.SaveMappings(dataobj).pipe(finalize(() => {
        setTimeout(() => {
          this.GetAgentList();
          this.ResetBuckets();
        }, 1000);
      })).subscribe(
        data => {
          this.ResponseHelper.GetSuccessResponse(data);
        },
        err => {
          this.ResponseHelper.GetFaliureResponse(err)
        }
      )
    }
  }
}

export class BucketModel {
  Never_Touched_Voice = false;
  Never_Touched_Non_Voice = false;
  Collectible_Insurance_Voice = false;
  Collectible_Insurance_Non_Voice = false;
  Collectible_Patient_Voice = false;
  Collectible_Patient_Non_Voice = false;
  Cash_In_Bank_Voice = false;
  Cash_In_Bank_Non_Voice = false;
  Call_Backs_Voice = false;
  Call_Backs_Non_Voice = false;
  Closed_Voice = false;
  Closed_Non_Voice = false;
  Special_Queue = false;
  Public_To_Call = false;
  Private_To_Call = false;
  Appeal_Follow_Up = false;
  To_Be_Appeal = false;
  TL_Deny = false;
  Client_Response = false;
  Coding_Help_Desk = false;
  Coding_Responses = false;
  CEX_Uncollectible = false;
  Manual_Queue = false;
}
