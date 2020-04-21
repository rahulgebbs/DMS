import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { Token } from 'src/app/manager/token';
import { CommonService } from 'src/app/service/common-service';
import { AutoAllocationService } from 'src/app/service/auto-allocation.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { dropDownFields } from 'src/app/manager/dropdown-feilds'
@Component({
  selector: 'app-auto-allocation',
  templateUrl: './auto-allocation.component.html',
  styleUrls: ['./auto-allocation.component.css'],
  providers: [dropDownFields]
})
export class AutoAllocationComponent implements OnInit {

  Title = "Auto Allocation Configuration";
  DisableClientList = false;
  ClientList: any[] = [];
  ClientId;
  DisableSearch = true;
  DisableSettingSave = true;
  DisableMatrixSave = true;
  HideAllData = true;
  ResponseHelper;
  UserId;
  Validated = false;
  SettingsForm: FormGroup;
  testForm: FormGroup
  MatrixForm: FormGroup;
  ClientSettings = new SettingModel();
  ClientMatrixData = new Array<MatrixModel>();
  GroupByList = []
  // ["Practice", "Account No", "Patient Name", "Provider Name", "Payer"];
  CallList = ["Private To Call", "Public To Call"];
  checkNumber: boolean = false;
  noclient: boolean = true;
  groupBy_Field = [];


  constructor(private selectedFields: dropDownFields, private router: Router, private notificationservice: NotificationService, private commonservice: CommonService, private autoservice: AutoAllocationService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    var token = new Token(this.router);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.ClientList = this.selectedFields.setSelected(userdata.Clients);
    this.SettingsForm = this.CreateSettingForm();
    if (this.ClientList[0].selected) {
      this.ClientId = this.ClientList[0].Client_Id
      // this.SettingsForm.value.Client_Id = this.ClientId
      this.SettingsForm.patchValue({ Client_Id: this.ClientId })
      this.GetAutoAllocation();
    }
    this.testForm = this.fb.group({
      'Client_Id': [''],
    })
    this.MatrixForm = this.CreateMatrixForm();
  }

  CreateMatrixForm() {
    return this.fb.group({
      'matrices': this.fb.array([
        this.fb.group({
          'Id': [''],
          'Client_Id': [''],
          'Target': ['', Validators.required],
          'To_Call_Routing': ['', Validators.required],
          'Updated_Date': ['']
        })
      ])
    })
  }




  CreateSettingForm() {
    return this.fb.group({
      'Id': [0],
      'Client_Id': [''],
      'Group_By': ['', Validators.required],
      'DOS_Days': ['', Validators.compose([Validators.required, Validators.max(365), Validators.pattern('^[0-9]+([0]{365})?$')])],
      'Last_Work_Date_Days': ['', Validators.compose([Validators.required, Validators.max(365), Validators.pattern('^[0-9]+([0]{365})?$')])],
      'Last_Bill_Date_Days': ['', Validators.compose([Validators.required, Validators.max(365), Validators.pattern('^[0-9]+([0]{365})?$')])],
      'Allocated_Accounts_Count': ['', Validators.compose([Validators.required, Validators.max(100), Validators.pattern('^[0-9]+([0]{100})?$')])],
      'Limit_Of_Private_To_Call': ['', Validators.compose([Validators.required, Validators.max(100), Validators.pattern('^[0-9]+([0]{100})?$')])],
      'Updated_Date': ['']
    })
  }

  ClientListOnChange(event) {
    this.GroupByList = []
    this.DisableMatrixSave = true;
    this.DisableSettingSave = true;
    this.HideAllData = true;
    this.ClientSettings = new SettingModel();
    this.ClientMatrixData = new Array<MatrixModel>();
    this.Validated = false;
    if (!event.target.value || event.target.value == "") {
      this.DisableSearch = true;
    }
    else {
      this.ClientId = event.target.value;
      this.SettingsForm.patchValue({ 'Client_Id': this.ClientId })
      this.DisableSearch = false;
    }
  }

  GetAutoAllocation() {
    this.Validated = false;
    this.DisableSettingSave = false;
    this.DisableMatrixSave = false
    this.GroupByList = []
    this.autoservice.GetAutoQueueAllocation(this.ClientId).subscribe(
      res => {

        this.GroupByList = this.selectedFields.setSelected(res.json().Data.GroupBy_Fields)
        // this.ClientSettings.Group_By =this.GroupByList[0].GroupBy_Field;

        this.ClientSettings = res.json().Data.Setting;
        this.SettingsForm.patchValue({ "Group_By": this.ClientSettings.Group_By })

        this.ClientMatrixData = res.json().Data.Effective_Matrix;
        this.ConfigureBucketName();
        this.SettingsForm.patchValue({ 'Id': this.ClientSettings.Id, 'Updated_Date': this.ClientSettings.Updated_Date })
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }

  GroupbyChange(e) {

    this.ClientSettings.Group_By = e.target.value;
    this.SettingsForm.patchValue({ "Group_By": this.ClientSettings.Group_By })
  }
  ConfigureBucketName() {
    this.ClientMatrixData.forEach(e => {
      switch (e.Queue_Name) {
        case "Public To Call":
        case "Private To Call":
        case "Special Queue":
        case "TL Deny":
          e.Bucket = e.Queue_Name;
          break;

        default:
          e.Bucket = e.Queue_Name + " " + e.Sub_Queue_Name;
          break;
      }
    })

  }

  SettingSubmit() {

    this.Validated = true;
    if (this.SettingsForm.valid && !this.checkNumber) {
      this.DisableSettingSave = true;
      this.DisableMatrixSave = true;
      this.DisableClientList = true;
      this.DisableSearch = true;
      this.SettingsForm.value.Client_Id = this.ClientId
      this.autoservice.UpdateSettings(this.SettingsForm.value).pipe(finalize(() => {
        this.DisableSettingSave = false;
        this.DisableMatrixSave = false;
        this.DisableClientList = false;
        this.DisableSearch = false;
      })).subscribe(
        res => {
          this.ResponseHelper.GetSuccessResponse(res);
          this.ClientSettings = res.json().Data;
          this.SettingsForm.patchValue({ 'Id': this.ClientSettings.Id, 'Client_Id': this.ClientId, 'Updated_Date': this.ClientSettings.Updated_Date })
        },
        err => {
          this.ResponseHelper.GetFaliureResponse(err);
        }
      );
    }
  }

  MatrixSubmit() {
    if (this.ClientMatrixData.length != 0) {
      this.DisableSettingSave = true;
      this.DisableMatrixSave = true;
      this.DisableClientList = true;
      this.DisableSearch = true;
      let dataobj = { Client_Id: this.ClientId, Effective_Matrix_List: this.ClientMatrixData }
      this.autoservice.UpdateMatrix(dataobj).pipe(finalize(() => {
        this.DisableSettingSave = false;
        this.DisableMatrixSave = false;
        this.DisableClientList = false;
        this.DisableSearch = false;
      })).subscribe(
        res => {
          this.ResponseHelper.GetSuccessResponse(res);
          this.ClientMatrixData = res.json().Data;
          this.ConfigureBucketName();
        },
        err => {
          this.ResponseHelper.GetFaliureResponse(err);
        }
      );
    }
  }

}

export class SettingModel {
  Allocated_Accounts_Count: number;
  Client_Id: number;
  Created_By;
  Created_Date;
  DOS_Days: number;
  Group_By;
  Id: number;
  Last_Bill_Date_Days: number;
  Last_Work_Date_Days: number;
  Updated_By;
  Updated_Date;
  Limit_Of_Private_To_Call;
}

export class MatrixModel {
  Id: number;
  Client_Id: number;
  Bucket;
  Condition_1;
  Condition_2;
  Over_Due_Condition;
  Queue_Name;
  Sub_Queue_Name;
  Target: number;
  To_Call_Routing;
  Updated_By: number;
  Updated_Date;
  Created_By: number;
  Created_Date;
}
