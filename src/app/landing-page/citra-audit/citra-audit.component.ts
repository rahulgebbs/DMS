import { Component, OnInit, Input } from '@angular/core';
import { CitraserviceService } from 'src/app/service/citraservice.service';
import { finalize } from 'rxjs/operators';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from "@angular/router";
import { Token } from 'src/app/manager/token';
import { DropdownService } from 'src/app/service/client-configuration/dropdown.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SaagService } from 'src/app/service/client-configuration/saag.service';
import { SupervisorDashboardService } from 'src/app/service/supervisor-dashboard.service';

@Component({
  selector: 'app-citra-audit',
  templateUrl: './citra-audit.component.html',
  styleUrls: ['./citra-audit.component.css'],
  providers: [CitraserviceService]
})

export class CitraAuditComponent implements OnInit {
  title: string = "citra audit";
  userdata
  AccountsList;
  GridApi;
  UserId = 0;
  ClientId = 0;
  Id = 0;
  InventoryId = 0;
  InventoryLogId = 0;
  PayerName = '';
  CurrentPayerName = '';
  InsurancePayerName = '';
  ActiveBucket = "";

  Buckets = [];
  CitraAccountsList = [];
  AllFields = [];
  columnDefs = [];
  SaagLookup = [];
  Status = [];
  SubStatus = [];
  ActionCode = [];
  ClientList: any[] = [];

  OpenAccountsModal = false;
  Validated = false;
  DisableSubmit = false;
  DisplayMain = false;
  MessageBox = false;
  AccountResolved = false;
  RCA = false;
  IsChecked = false;
  IsCallChecked = false;
  IsFilterChecked = false;
  show = false;
  formsubmitted = false;

  ActionForm: FormGroup;
  ActionForm1: FormGroup;
  ActionForm12: FormGroup
  dashboard: FormGroup;
  ResponseHelper: ResponseHelper;

  constructor(private dash: SupervisorDashboardService, private citraservice: CitraserviceService, private notificationservice: NotificationService, private router: Router, private dropdownservice: DropdownService, private fb: FormBuilder, private saagservice: SaagService) {
    this.CreateActionForm();
    this.CreateActionForm1();
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    this.dashboard = this.fb.group({
      "ClientId": [],
      "Client_Name": [],
      "rdbfilter": []
    })
    // this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }

  ngOnInit() {
    var token = new Token(this.router);
    // var userdata = token.GetUserData();
    this.userdata = token.GetUserData();
    this.UserId = this.userdata.UserId;
    this.ClientId = this.userdata.Clients[0].Client_Id;
    this.GetClientList();
    var filter = this.dashboard.controls['rdbfilter'].value;
    if (filter = "null") {
      this.IsFilterChecked = true;
      this.dashboard.controls["rdbfilter"].setValue('Current');
    }

  }

  CreateActionForm() {
    this.ActionForm = this.fb.group({
      'Status': ['', Validators.required],
      'SubStatus': ['', Validators.required],
      'ActionCode': ['', Validators.required],
      'WorkStatus': ['', Validators.required],
      'Notes': ['', Validators.required]
    })
  }

  CreateActionForm1() {
    this.ActionForm1 = this.fb.group(
      {
        'drpRateCall': [""],
        'drpTransaction': [""],
        'txtfeedback': [""],
        'txtComments': [""],
        'drpReRes': [""],
        'txtRca': [""],
        'Call': [""],
        'AccountResolved': [""],
        'txtProcessTrendsIdentified':['', Validators.required],
        'txtGlobalTrendsIdentified' : ['', Validators.required]
      })
  }





  GetClientList() {

    this.dash.GetClientList(this.UserId).subscribe(
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

  selectedValue(data) {

    if (data.length == 1 && data.length) {

      data[0].selected = true;
      this.ClientId = data[0].Id

      // this.selectedClient()
    } else {

    }

  }

  selectedClient() {

    this.GetBucketsWithCount();
    // var ress = this.ActionForm1.controls['AccountResolved'].value;
    // var res = this.ActionForm1.controls['Call'].value;
    // if (ress == "") {
    //   this.IsChecked = true;
    //   this.ActionForm1.controls['txtRca'].disable();
    //   this.ActionForm1.controls["AccountResolved"].setValue('Yes');
    // }
    // if (res == "") {
    //   this.IsCallChecked = true;
    //   this.ActionForm1.controls["Call"].setValue('Y');
    // }
    // this.DisplayMain = false;


    this.ActionForm1.patchValue({'AccountResolved':'Yes'});
    this.ActionForm1.patchValue({'Call':'Y'});
    this.ActionForm1.controls["txtRca"].clearValidators();
    this.ActionForm1.controls['drpReRes'].setValidators([Validators.required])
    this.ActionForm1.controls['drpReRes'].updateValueAndValidity()
    this.ActionForm1.controls['txtRca'].updateValueAndValidity()
    this.DisplayMain = false;
  }

  onClientChange(e) {

    this.ClientId = e.target.value

  }

  ToggleAccountsModal(event) {
    this.OpenAccountsModal = false;
    if (event != false && event != true) {
      if (event.includes("Citra")) {
        this.GetAccountList(event, false);
        this.OpenAccountsModal = true;
      }
    }
  }

  GetAccountList(bucketname: string, fromsubmit) {
    this.citraservice.GetBucketsWithCount(this.dashboard.controls['rdbfilter'].value, this.ClientId).pipe(finalize(() => {
    })).subscribe(
      res => {
        this.CitraAccountsList = res.json().Data.Citra_Details_Info;
        console.log(this.CitraAccountsList);
        if (this.CitraAccountsList.length > 0) {

          if (bucketname.indexOf('Appeal') == -1) {
            if (this.CitraAccountsList[0].Inventory_Log_Id) {
              this.InventoryLogId = this.CitraAccountsList[0].Inventory_Log_Id;
              this.Id = this.CitraAccountsList[0].Id;
            }
            else {
              this.InventoryLogId = 0;
              this.Id = 0;
            }
            // this.GetAllFields(bucketname, this.AccountsList[0].Inventory_Id, false);
          }
        }

        if (fromsubmit == false) {
          this.OpenAccountsModal = true;
        }
        else {
          if (bucketname.indexOf('Appeal') == -1) {
            this.GetAllFields(bucketname, this.AccountsList[0].Inventory_Id, false);
          }
          else {
            this.Id = 0;
            this.InventoryId = 0;
            this.InventoryLogId = 0;
            this.AllFields = [];
          }
        }
      },
      err => {

        if (fromsubmit == true) {
          this.AllFields = [];
          this.Id = 0;
          this.InventoryId = 0;
          this.InventoryLogId = 0;
        }
        else {
          this.OpenAccountsModal = false;
          this.ResponseHelper.GetFaliureResponse(err);
        }

      }
    );
  }


  GetBucketsWithCount() {
    this.citraservice.GetBucketsWithCount(this.dashboard.controls['rdbfilter'].value, this.ClientId).pipe(finalize(() => {
    })).subscribe(
      res => {
        this.ClientId = res.json().Data.Status_Info[0].ClientID;
        this.Buckets = res.json().Data.Status_Info;
        this.GetSaagLookup();
      },
      err => {
        console.log(err);
        if (err.status == 400) {
          this.Buckets = [];
          this.InventoryId = 0;
        }
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }

  GetSaagLookup() {
    this.Status = [];
    this.saagservice.getSaagLookup(this.ClientId).subscribe(data => {
      this.SaagLookup = data.json().Data.SAAG_Lookup;
      let status = this.SaagLookup.map(function (obj) { return obj.Status; });
      this.Status = status.filter(function (item, pos) { return status.indexOf(item) == pos; })
      if (this.Status.length == 1) {
        this.ActionForm.patchValue({ "Status": this.Status[0] });
      }
    }, err => {
      this.ResponseHelper.GetFaliureResponse(err)
    })
  }

  GetAllFields(bucketname, obj, fromPopup) {

    var ress = this.ActionForm1.controls['AccountResolved'].value;
    if (ress == "Yes") {
      this.ActionForm1.controls['txtRca'].disable();
    }

    var oldinvenid = this.InventoryId;
    var oldinvenlogid = this.InventoryLogId;
    if (fromPopup === true) {
      bucketname = obj.Bucket_Name;
      this.InventoryId = obj.Inventory_Id;
      this.InventoryLogId = obj.Inventory_Log_Id;
      this.Id = obj.Id;
    }
    else {
      this.InventoryId = obj;
    }

    this.GetAllFieldsApiCall(bucketname, this.InventoryId, fromPopup);

  }

  GetAllFieldsApiCall(bucketname, inventoryId: number, fromPopup: boolean) {
    this.citraservice.GetAllFields(this.ClientId, inventoryId, this.InventoryLogId, bucketname).pipe(finalize(() => {
      // this.ClearForm();
      // this.Validated = false;
    })).subscribe(
      res => {
        this.AllFields = res.json().Data;
        console.log(this.AllFields);

        this.ManageNullFields();
        this.MapActionFields();

        this.DisplayMain = true;
        if (fromPopup == true) {
          this.OpenAccountsModal = false;
        }
      },
      err => {

        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }

  ManageNullFields() {
    this.AllFields.forEach(e => {
      if (e.Display_Name.indexOf('Payer') != -1) {
        this.CurrentPayerName = e.FieldValue;
      }
      if (e.Is_Standard_Field) {
        switch (e.Column_Datatype) {
          case "Text":
            if (e.Display_Name.indexOf('Payer') != -1) {
              this.InsurancePayerName = e.FieldValue;
            }
            break;
          case "Date":
            if (e.FieldValue != null) {
              var d = new Date(e.FieldValue);
              e.FieldValue = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
            }
            break;
        }
      }
      else {
        switch (e.Column_Datatype) {
          case "Text":
            if (e.Is_Dropdown_Field && e.Is_View_Allowed_Agent && e.Is_Edit_Allowed_Agent) {
              var dropdownlist = [];
              this.dropdownservice.getDropdownValue(this.ClientId, e.Id).subscribe(
                res => {
                  dropdownlist = res.json().Data;
                  e.DropdownList = dropdownlist
                },
                err => {
                  // this.ResponseHelper.GetFaliureResponse(err);
                }
              )
            }
            break;

          case "Date":
            if (!e.Is_Edit_Allowed_Agent && e.Is_View_Allowed_Agent) {
              if (e.FieldValue != null) {
                var d = new Date(e.FieldValue);
                e.FieldValue = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
              }
            }
            break;
        }
      }
    })
  }

  MapActionFields() {

    // var res = this.ActionForm1.controls['AccountResolved'].value;
    // if (res == "") {
    this.IsChecked = false;
    this.IsCallChecked = false;

    this.AllFields.forEach(e => {
      switch (e.Header_Name) {
        case 'Id':
          this.Id == e.FieldValue;
          break;
        case 'Inventory_Log_Id':
          this.InventoryLogId == e.FieldValue;
          break;
        case 'Status':
          this.ActionForm.patchValue({ Status: e.FieldValue });
          break;
        case 'Sub_Status':
          var substatus = [];
          this.SaagLookup.forEach((e) => {
            if (e.Status == this.ActionForm.get('Status').value) {
              substatus.push(e.Sub_Status);
            }
          });

          this.SubStatus = substatus.filter(function (item, pos) {
            return substatus.indexOf(item) == pos;
          });
          this.ActionForm.patchValue({ SubStatus: e.FieldValue });
          break;
        case 'Action_Code':
          let actionCode = [];
          this.SaagLookup.forEach((e) => {
            if (
              e.Sub_Status == this.ActionForm.get('SubStatus').value &&
              e.Status == this.ActionForm.get('Status').value
            ) {
              actionCode.push(e.Action_Code);
            }
          });

          this.ActionCode = actionCode.filter(function (item, pos) {
            return actionCode.indexOf(item) == pos;
          });
          this.ActionForm.patchValue({ ActionCode: e.FieldValue });
          break;
        // case 'Account_Status':
        //   this.ActionForm.patchValue({ WorkStatus: e.FieldValue });
        //   break;
        case 'Notes':
          this.ActionForm.patchValue({ Notes: e.FieldValue });
          break;
        case 'Call':
          if (e.FieldValue == "Y") {
            this.IsCallChecked = true;
          }
          else if (e.FieldValue == "") {
            this.IsCallChecked = true;
          }
          else {
            this.IsCallChecked = false;
          }
          this.ActionForm1.patchValue({ Call: e.FieldValue });
          break;
        // case 'Rate_Call':
        //   this.ActionForm1.patchValue({ drpRateCall: e.FieldValue });
        //   break;
        case 'Feedback_Call':
          this.ActionForm1.patchValue({ txtfeedback: e.FieldValue });
          break;
        // case 'TL_Comments_Insight':
        //   this.ActionForm1.patchValue({ txtComments: e.FieldValue });
        //   break;
        // case 'Transactions':
        //   this.ActionForm1.patchValue({ drpTransaction: e.FieldValue });
        //   break;
        case 'RCA':
          this.ActionForm1.patchValue({ txtRca: e.FieldValue });
          break;
        case 'AccountResolved':
          this.ActionForm1.patchValue({ AccountResolved: e.FieldValue });
          this.EnableDisableFields(e.FieldValue);
          break;
        case 'ResolvedReason':
          this.ActionForm1.patchValue({ drpReRes: e.FieldValue });
          break;
        // case 'ResolvedReason':
        //     var ResolvedReason = [];
        //     this.SaagLookup.forEach((e) => {
        //       if (e.ResolvedReason == this.ActionForm1.get('drpReRes').value) {
        //         ResolvedReason.push(e.drpReRes);
        //       }
        //     });

      }
    })
  }

  OnAccountResolvedChange(evt) {
    var target = evt.target;
    if (target.value == "Yes") {
      this.ActionForm1.controls['txtRca'].disable();
      this.ActionForm1.controls['drpReRes'].enable();
      this.ActionForm1.controls['txtRca'].setValue('');
      this.ActionForm1.controls["txtRca"].clearValidators();
      this.ActionForm1.controls['drpReRes'].setValidators([Validators.required])

    }
    else {
      this.ActionForm1.controls["drpReRes"].clearValidators();
      this.ActionForm1.controls["drpReRes"].setValue('');
      this.ActionForm1.controls['txtRca'].enable();
      this.ActionForm1.controls['drpReRes'].disable();
      this.ActionForm1.controls['txtRca'].setValidators([Validators.required]);
    }
    this.ActionForm1.controls['drpReRes'].updateValueAndValidity();
    this.ActionForm1.controls['txtRca'].updateValueAndValidity();
  }

  

  EnableDisableFields(val) {
    if (val == "Yes") {
      this.ActionForm1.controls['txtRca'].disable();
      this.ActionForm1.controls['drpReRes'].enable();
    }
    else if (val == "") {
      this.IsChecked = true;
      this.ActionForm1.controls['txtRca'].disable();
      this.ActionForm1.controls['drpReRes'].enable();
      this.ActionForm1.controls["AccountResolved"].setValue('Yes');
    }
    else {
      this.ActionForm1.controls['txtRca'].enable();
      this.ActionForm1.controls['drpReRes'].disable();
    }

  }


  SubmitForm() {
    this.formsubmitted = true;
    console.log('submitform: ',this.ActionForm1)
    if (!this.ActionForm1.valid) {
      return;
    }

    var objs = new Object();

    this.AccountResolved = this.ActionForm1.controls['AccountResolved'].value;
    objs['Client_Id'] = this.ClientId;
    objs['Id'] = this.Id;
    objs['Inventory_Id'] = this.InventoryId;
    objs['Inventory_Log_Id'] = this.InventoryLogId;
    objs["Status"] = this.ActionForm.controls['Status'].value;
    objs["Sub-Status"] = this.ActionForm.controls['SubStatus'].value;
    objs["Action_Code"] = this.ActionForm.controls['ActionCode'].value;
    objs['Notes'] = this.ActionForm.controls['Notes'].value;
    objs["AccountResolved"] = this.ActionForm1.controls['AccountResolved'].value;
    objs["Call"] = this.ActionForm1.controls['Call'].value;
    objs["txtfeedback"] = this.ActionForm1.controls['txtfeedback'].value;
    objs["txtComments"] = this.ActionForm1.controls['txtComments'].value;
    objs["txtRca"] = this.ActionForm1.controls['txtRca'].value;
    objs["drpRateCall"] = this.ActionForm1.controls['drpRateCall'].value;
    objs["drpTransaction"] = this.ActionForm1.controls['drpTransaction'].value;
    objs["drpReRes"] = this.ActionForm1.controls['drpReRes'].value;
    objs["txtGlobalTrendsIdentified"] = this.ActionForm1.controls['txtGlobalTrendsIdentified'].value;
    objs["txtProcessTrendsIdentified"] = this.ActionForm1.controls['txtProcessTrendsIdentified'].value;


    var obj = new Object();
    obj['Fields'] = objs;

    this.DisableSubmit = true;
    this.citraservice.SaveAllFields(obj).pipe(finalize(() => {
      this.GetBucketsWithCount();
      this.DisableSubmit = false;
    })).subscribe(
      res => {
        this.ClearForm();
        this.ResponseHelper.GetSuccessResponse(res);
        this.DisplayMain = false;
      },
      err => {

        if (err.status == 403) {
          sessionStorage.removeItem("Accounts");
          this.InventoryId = 0;
          this.ActiveBucket = '';
          this.ClearForm();
          this.AccountsList = [];
        }
        if (err.status == 406) {
          this.OpenAccountsModal = false;
          this.DisplayMain = false;
          // this.DisplayMessage = "This Account is already in special queue";
          this.InventoryId = 0;
          // this.InventoryLogId = 0;
          this.ActiveBucket = '';
          this.ClearForm();
          this.AccountsList = [];
        }
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );

  }

  ClearForm() {
    this.Validated = false;
    this.CreateActionForm();
    this.CreateActionForm1();
  }
}




