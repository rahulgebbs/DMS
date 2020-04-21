import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { Token } from 'src/app/manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/service/common-service';
import { SaagService } from 'src/app/service/client-configuration/saag.service';
import { AgentCorrespodanceService } from './../../service/agent-correspodance.service';



@Component({
  selector: 'app-agent-correspodance',
  templateUrl: './agent-correspodance.component.html',
  styleUrls: ['./agent-correspodance.component.css']
})
export class AgentCorrespodanceComponent implements OnInit {
  Title = "Add Correspodence";
  ResponseHelper: ResponseHelper
  UserId = 0;
  ClientList: any[] = [];
  ClientId: number = 0;
  OpenAccountsModal = false;
  OpenNotesGenerator = false;
  ActionForm: FormGroup;
  Validated = false;
  Status = [];
  SubStatus = [];
  ActionCode = [];
  SaagLookup = [];
  InventoryId = 0;
  InventoryLogId = 0;
  AllFields = [];
  DisplayMain = false;
  // DisplayMessage: string = "Please select the Client";
  searchBtnDisable: boolean = false;
  MinDate: Date;
  DisableSubmit = false;
  submitted: boolean = false;

  constructor(private service: AgentCorrespodanceService, private saagservice: SaagService, private commonservice: CommonService, private router: Router, private notificationservice: NotificationService, private fb: FormBuilder) { }

  ngOnInit() {

    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    var token = new Token(this.router);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    // this.GetClientList();
    this.ClientList = userdata.Clients;
    this.selectedValue(this.ClientList)
    this.CreateActionForm();
    //   this.MinDate = new Date('01/01/1900');
  }

  ClearForm() {
    this.Validated = false;
    this.ActionForm.reset();
  }

  GetAllFields() {

    this.service.GetAllFields(this.ClientId).pipe(finalize(() => {
      this.Validated = false;
      this.searchBtnDisable = false;
    })).subscribe(
      res => {
        this.AllFields = res.json().Data;
        this.DisplayMain = true;

      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }





  selectedValue(data) {
    if (data.length == 1 && data.length) {
      data[0].selected = true;
      this.ClientId = data[0].Client_Id;
      this.searchBtnDisable = false;
      this.GetAllFields();
      this.GetSaagLookup();
    } else {
      this.searchBtnDisable = true;
      this.ClientId = 0;
      this.DisableSubmit = true;
    }
  }

  GetSaagLookup() {
    this.Status = [];
    this.service.getSaagLookup(this.ClientId).subscribe(data => {
      this.SaagLookup = data.json().Data.SAAG_Lookup;
      let status = this.SaagLookup.map(function (obj) { return obj.Status; });
      this.Status = status.filter(function (item, pos) { return status.indexOf(item) == pos; })
      if (this.Status.length == 1) {
        this.ActionForm.patchValue({ "Status": this.Status[0] });
        this.OnStatusChange(this.Status[0])

      }
    }, err => {
      this.ResponseHelper.GetFaliureResponse(err)
    })
  }


  ToggleAccountsModal() {
    this.searchBtnDisable = true;
    this.GetSaagLookup();
    this.GetAllFields();

    //this.OpenAccountsModal = !this.OpenAccountsModal;
  }

  BlockInput(event) {
    if (event.key == 'Backspace' || event.key == 'Tab') {
      return true;
    }
    else {
      return false;
    }

  }

  ClientOnChange(event) {
    this.searchBtnDisable = true;
    this.DisableSubmit = false;
    if (event.target.value != '0' && event.target.value) {
      this.ClientId = event.target.value;
      // this.GetSaagLookup();
      this.searchBtnDisable = false;
    }
    else {
      this.DisableSubmit = true;
    }
  }

  OnStatusChange(event) {
    this.ActionForm.patchValue({ "Sub-Status": "" })
    this.ActionForm.patchValue({ "Action_Code": "" })

    this.SubStatus = [];
    let substatus = [];
    if (!event.target) {
      this.SaagLookup.forEach(e => {
        if (e.Status == event) {
          substatus.push(e.Sub_Status)
        }
      })
    } else {
      this.SaagLookup.forEach(e => {
        if (e.Status == event.target.value) {
          substatus.push(e.Sub_Status)
        }
      })
    }

    this.SubStatus = substatus.filter(function (item, pos) {
      return substatus.indexOf(item) == pos;
    })
    if (this.SubStatus.length == 1) {
      this.ActionForm.patchValue({ "Sub-Status": this.SubStatus[0] })
      this.OnSubStatusChange(this.SubStatus[0])
    }

  }


  OnSubStatusChange(event) {
    this.ActionForm.patchValue({ "Action_Code": "" })
    this.ActionCode = [];
    let actionCode = [];
    if (!event.target) {
      this.SaagLookup.forEach(e => {
        if (e.Sub_Status == event && e.Status == this.ActionForm.get('Status').value) {
          actionCode.push(e.Action_Code)
        }
      })
    }
    else {
      this.SaagLookup.forEach(e => {
        if (e.Sub_Status == event.target.value && e.Status == this.ActionForm.get('Status').value) {
          actionCode.push(e.Action_Code)
        }
      })
    }

    this.ActionCode = actionCode.filter(function (item, pos) {
      return actionCode.indexOf(item) == pos;
    })
    if (this.ActionCode.length == 1) {
      this.ActionForm.patchValue({ "Action_Code": this.ActionCode[0] })
    }
  }


  ToggleNotesGenerator(event) {
    if (event != null && event != false) {
      this.ActionForm.patchValue({ 'Notes': event })
    }
    this.OpenNotesGenerator = !this.OpenNotesGenerator;
  }

  CreateActionForm() {
    this.ActionForm = this.fb.group({
      'Status': ['', Validators.required],
      'Sub-Status': ['', Validators.required],
      'Action_Code': ['', Validators.required],
      'Account_Status': ['', Validators.required],
      'Notes': ['', Validators.required]
    })
  }


  SubmitForm() {

    this.submitted = true
    this.Validated = true;
    if (this.ActionForm.valid) {
      var valid = true;
      this.AllFields.forEach(e => {

        if (e.Column_Datatype == "Date" && (e.FieldValue == null || e.FieldValue == "")) {
          valid = false
        }
        else if (e.Column_Datatype == 'Text' && (e.FieldValue == null || e.FieldValue == "")) {
          valid = false;
        }

      });

      if (valid) {


        var objs = new Object();

        objs['Client_Id'] = this.ClientId;

        this.AllFields.forEach(e => {

          objs[e.Header_Name] = e.FieldValue;

        });
        objs['Notes'] = this.ActionForm.controls['Notes'].value;
        objs["Status"] = this.ActionForm.controls['Status'].value;
        objs["Sub-Status"] = this.ActionForm.controls['Sub-Status'].value;
        objs["Action_Code"] = this.ActionForm.controls['Action_Code'].value;
        objs["Account_Status"] = this.ActionForm.controls['Account_Status'].value;

        var obj = new Object();
        obj['Fields'] = objs;


        this.DisableSubmit = true;
        this.service.SaveAllFields(obj).pipe(finalize(() => {
          this.DisableSubmit = false;
          this.submitted = false
          this.Validated = false;
        })).subscribe(
          res => {
            this.ClearForm();
            this.AllFields = [];
            this.ResponseHelper.GetSuccessResponse(res);
            this.GetAllFields();

          },
          err => {

            this.AllFields = [];
            this.ClearForm();


            this.ResponseHelper.GetFaliureResponse(err);
          }
        );
      }
    }
  }

}


