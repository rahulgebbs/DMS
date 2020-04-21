import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ClientInsuranceService } from 'src/app/service/client-insurance.service';
import { GlobalInsuranceService } from 'src/app/service/global-insurance.service';
import { Token } from 'src/app/manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import { GlobalMappingService } from 'src/app/service/global-mapping.service';
import { Router } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';

@Component({
  selector: 'app-mapping-modal',
  templateUrl: './mapping-modal.component.html',
  styleUrls: ['./mapping-modal.component.css']
})
export class MappingModalComponent implements OnInit {
  // @Input SelectedClient: ModalData = new ModalData();
  // @Input SelectedGlobal: ModalData = new ModalData();
  @Input() readonly SelectedClient: ModalData;
  @Input() SelectedGlobal: ModalData;
  @Output() Toggle = new EventEmitter<any>();
  @Output() ApiCallback = new EventEmitter<any>();
  ShowModal = true;
  DisableSubmit = false;
  TempStorage;
  ShowCheckbox = true;
  ResponseHelper


  constructor(private router: Router, private notificationservice: NotificationService, private mappingservice: GlobalMappingService, private clientservice: ClientInsuranceService, private globalservice: GlobalInsuranceService) {
    let token= new Token(this.router);
  }
  ngOnInit() {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.SelectedGlobal.currentValue != null) {
      this.SelectedGlobal = changes.SelectedGlobal.currentValue;
      this.TempStorage = changes.SelectedGlobal.currentValue;
    }
    if (this.SelectedGlobal.Id != 0) {
      this.ShowCheckbox = false;
    }
  }

  ToggleModal() {
    this.ShowModal = false;
    this.Toggle.emit(this.ShowModal);
    this.DisableSubmit = false;
  }

  checkValue(event) {
    if (this.SelectedGlobal.Id == 0) {

      if (event.currentTarget.checked) {
        this.SelectedGlobal = new ModalData();
        this.SelectedGlobal.Practice_Name = this.SelectedClient.Practice_Name;
        this.SelectedGlobal.Payer_Name = this.SelectedClient.Payer_Name;
        this.SelectedGlobal.Timely_Filing_Limits_in_Days = this.SelectedClient.Timely_Filing_Limits_in_Days;
        this.SelectedGlobal.Contact_Number = this.SelectedClient.Contact_Number;
        this.SelectedGlobal.Website = this.SelectedClient.Website;
        this.SelectedGlobal.Start_Time = this.SelectedClient.Start_Time;
        this.SelectedGlobal.Claim_Mailing_Address = this.SelectedClient.Claim_Mailing_Address;
        this.SelectedGlobal.Appeal_Mailing_Address = this.SelectedClient.Appeal_Mailing_Address;
        this.SelectedGlobal.End_Time = this.SelectedClient.End_Time;
        this.SelectedGlobal.Appeal_Filing_Limit_In_Days = this.SelectedClient.Appeal_Filing_Limit_In_Days;
        this.SelectedGlobal.Financial_Class = this.SelectedClient.Financial_Class;
        this.SelectedGlobal.Appeal_Mailing_Address1 = this.SelectedClient.Appeal_Mailing_Address1;
        this.SelectedGlobal.Appeal_Mailing_Address2 = this.SelectedClient.Appeal_Mailing_Address2;
        this.SelectedGlobal.Appeal_Mailing_City = this.SelectedClient.Appeal_Mailing_City;
        this.SelectedGlobal.Appeal_Mailing_State = this.SelectedClient.Appeal_Mailing_State;
        this.SelectedGlobal.Appeal_Mailing_Zipcode = this.SelectedClient.Appeal_Mailing_Zipcode;
        this.SelectedGlobal.Claim_Mailing_Address1 = this.SelectedClient.Claim_Mailing_Address1;
        this.SelectedGlobal.Claim_Mailing_Address2 = this.SelectedClient.Claim_Mailing_Address2;
        this.SelectedGlobal.Claim_Mailing_City = this.SelectedClient.Claim_Mailing_City;
        this.SelectedGlobal.Claim_Mailing_State = this.SelectedClient.Claim_Mailing_State;
        this.SelectedGlobal.Claim_Mailing_Zipcode = this.SelectedClient.Claim_Mailing_Zipcode;
        this.SelectedGlobal.Fax_No = this.SelectedClient.Fax_No;
        this.SelectedGlobal.Insurance_Name_Gebbs = this.SelectedClient.Insurance_Name_Gebbs;
        this.SelectedGlobal.Appeal_Mailing_FaxNo = this.SelectedClient.Appeal_Mailing_FaxNo;
        this.SelectedGlobal.Claim_Mailing_FaxNo = this.SelectedClient.Claim_Mailing_FaxNo;
        this.SelectedGlobal.Appeal_Mailing_ContactNo = this.SelectedClient.Appeal_Mailing_ContactNo;
        this.SelectedGlobal.Claim_Mailing_ContactNo = this.SelectedClient.Claim_Mailing_ContactNo;
        this.SelectedGlobal.Insurance_Name_for_Appeal = this.SelectedClient.Insurance_Name_for_Appeal;
        this.SelectedGlobal.Insurance_Code = this.SelectedClient.Insurance_Code;
        this.SelectedGlobal.Insurance_State = this.SelectedClient.Insurance_State;
        this.SelectedGlobal.Is_IVR = this.SelectedClient.Is_IVR;
        this.SelectedGlobal.Is_Voice = this.SelectedClient.Is_Voice;
        this.SelectedGlobal.Email_Id = this.SelectedClient.Email_Id;
        this.SelectedGlobal.CSR_Fax = this.SelectedClient.CSR_Fax;
        this.SelectedGlobal.Attention_To = this.SelectedClient.Attention_To;

        this.SelectedGlobal.Id = 0;
        this.SelectedGlobal.Client_Id = this.TempStorage.Client_Id;
        this.SelectedGlobal.Client_Insurance_Id = this.TempStorage.Client_Insurance_Id;
      }
      else {
        this.SelectedGlobal = this.TempStorage;
      }
    }
  }

  MapInsurance() {
    this.DisableSubmit = true;
    if (this.SelectedGlobal.Id != 0) {
      this.mappingservice.UpdateMapping(this.SelectedGlobal).subscribe(
        data => {
          this.ResponseHelper.GetSuccessResponse(data);
          this.ToggleModal();
          this.ApiCallback.emit(true);
        },
        err => {
          this.ResponseHelper.GetFaliureResponse(err);
          this.DisableSubmit = false;
        }
      );;
    }
    else {
      delete this.SelectedGlobal.Id;
      this.mappingservice.InsertMapping(this.SelectedGlobal).subscribe(
        data => {
          this.ResponseHelper.GetSuccessResponse(data)
          this.ToggleModal();
          this.ApiCallback.emit(true);
        },
        err => {
          this.SelectedGlobal.Id = 0;
          this.ResponseHelper.GetFaliureResponse(err);
          this.DisableSubmit = false;
        }
      );;
    }
  }
}

export class ModalData {

  constructor() {
    this.Practice_Name = "";
    this.Payer_Name = "";
    this.Timely_Filing_Limits_in_Days = 1;
    this.Contact_Number = "";
    this.Website = "";
    this.Start_Time = "";
    this.Claim_Mailing_Address = "";
    this.Appeal_Mailing_Address = "";
    this.End_Time = "";
    this.Appeal_Filing_Limit_In_Days = 1;
    this.Financial_Class = "";
    this.Appeal_Mailing_Address1 = "";
    this.Appeal_Mailing_Address2 = "";
    this.Appeal_Mailing_City = "";
    this.Appeal_Mailing_State = "";
    this.Appeal_Mailing_Zipcode = "";
    this.Claim_Mailing_Address1 = "";
    this.Claim_Mailing_Address2 = "";
    this.Claim_Mailing_City = "";
    this.Claim_Mailing_State = "";
    this.Claim_Mailing_Zipcode = "";
    this.Fax_No = "";
    this.Insurance_Name_Gebbs = "";
    this.Appeal_Mailing_FaxNo = "";
    this.Claim_Mailing_FaxNo = "";
    this.Appeal_Mailing_ContactNo = "";
    this.Claim_Mailing_ContactNo = "";
    this.Insurance_Name_for_Appeal = "";
    this.Insurance_Name_for_Mail = "";
    this.Insurance_Code = "";
    this.Insurance_State = "";
    this.Is_IVR = false;
    this.Is_Voice = false;
    this.Email_Id = "";
    this.CSR_Fax = "";
    this.Attention_To = "";
  }
  Id;
  Client_Id;
  Client_Insurance_Id;
  Practice_Name;
  Payer_Name;
  Timely_Filing_Limits_in_Days;
  Contact_Number;
  Website;
  Start_Time;
  Claim_Mailing_Address;
  Appeal_Mailing_Address;
  End_Time;
  Appeal_Filing_Limit_In_Days;
  Financial_Class;
  Appeal_Mailing_Address1;
  Appeal_Mailing_Address2;
  Appeal_Mailing_City;
  Appeal_Mailing_State;
  Appeal_Mailing_Zipcode;
  Claim_Mailing_Address1;
  Claim_Mailing_Address2;
  Claim_Mailing_City;
  Claim_Mailing_State;
  Claim_Mailing_Zipcode;
  Fax_No;
  Insurance_Name_Gebbs;
  Appeal_Mailing_FaxNo;
  Claim_Mailing_FaxNo;
  Appeal_Mailing_ContactNo;
  Claim_Mailing_ContactNo;
  Insurance_Name_for_Appeal;
  Insurance_Name_for_Mail;
  Insurance_Code;
  Insurance_State;
  Is_IVR;
  Is_Voice;
  Email_Id;
  CSR_Fax;
  Attention_To;
}
