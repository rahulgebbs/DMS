
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InsuranceService } from 'src/app/service/client-configuration/insurance.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { Router } from '@angular/router';
import { Token } from 'src/app/manager/token';

@Component({
  selector: 'app-insurance-modal',
  templateUrl: './insurance-modal.component.html',
  styleUrls: ['./insurance-modal.component.css']
})
export class InsuranceModalComponent implements OnInit {

  addInsurance: FormGroup;
  @Input() ClientData;
  @Input() selectedClientRow: insuranceInfo = new insuranceInfo();
  @Output() Toggle = new EventEmitter<any>();
  @Output() getInsuranceDatas = new EventEmitter<any>();
  @Input() onAdd: boolean;
  @Input() onEdit: boolean;



  validated;
  insuranceData;
  rowData;
  userData;
  token: Token;
  ResponseHelper: ResponseHelper;
  ShowModal = true;
  showPopup: boolean = false;
  DisplayModal: boolean = false;
  good: boolean = true;
  bad: boolean = false;
  saveDisabled:boolean=false


  constructor(private router: Router, public fb: FormBuilder, private services: InsuranceService, private notificationservice: NotificationService) {
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();
                this.ResponseHelper = new ResponseHelper(this.notificationservice);


  }

  ngOnInit() {

    this.selectedClientRow
    this.addInsurance = this.fb.group({
      "Practice_Name": [""],
      "Payer_Name": ["", Validators.required],
      "Global_Insurance_Added": [""],
      "Timely_Filing_Limits_in_Days": ["", Validators.required],
      "Contact_Number": ["" ,Validators.required],
      "Website": [""],
      "Start_Time": [""],
      "Claim_Mailing_Address": [""],
      "Appeal_Mailing_Address": [""],
      "End_Time": [""],
      "Appeal_Filing_Limit_In_Days": [""],
      "Financial_Class": [""],
      "Appeal_Mailing_Address1": [""],
      "Appeal_Mailing_Address2": [""],
      "Appeal_Mailing_City": [""],
      "Appeal_Mailing_State": [""],
      "Appeal_Mailing_Zipcode": [""],
      "Claim_Mailing_Address1": [""],
      "Claim_Mailing_Address2": [""],
      "Claim_Mailing_City": [""],
      "Claim_Mailing_State": [""],
      "Claim_Mailing_Zipcode": [""],
      "Fax_No": [""],
      "Insurance_Name_Gebbs": [""],
      "Appeal_Mailing_FaxNo": [""],
      "Claim_Mailing_FaxNo": [""],
      "Appeal_Mailing_ContactNo": [""],
      "Claim_Mailing_ContactNo": [""],
      "Insurance_Name_for_Appeal": [""],
      "Insurance_Name_for_Mail": [""],
      "Insurance_Code": [""],
      "Insurance_State": [""],
      "Is_IVR": [""],
      "Is_Voice": ["", Validators.required],
      "Email_Id": [""],
      "CSR_Fax": [""],
      "Attention_To": [""],
      "Client_Id": [""],
      "Global_Insurance_Id": [""],
    });
  }

  getInsuranceDetail() {
    if (this.ClientData) {
      this.services.getInsuranceData(this.ClientData.Id).subscribe(data => {
        let res = data.json()
        this.rowData = res.Data
        this.insuranceData = res.Data
      }, err => {
        this.ResponseHelper.GetFaliureResponse(err);
      })
    }
  }




  submitForm() {
    this.validated = true;
    this.addInsurance.patchValue({ Client_Id: this.ClientData.Id })
    if (this.addInsurance.value && this.addInsurance.valid) {
      this.saveDisabled=true      
      if (this.selectedClientRow.Id) {
        this.services.updateClientRow(this.selectedClientRow).pipe(finalize(() => {
        })).subscribe(
          res => {
            this.ResponseHelper.GetSuccessResponse(res);
            this.ToggleModal();
            this.getInsuranceDatas.emit()
            this.ClientData.Is_Insurance_Uploaded = true;
            this.saveDisabled=false
          },
          err => {
            this.ResponseHelper.GetFaliureResponse(err);
            this.saveDisabled=false
          }
        );
      }
      else {
        
        this.addInsurance.patchValue({ Global_Insurance_Id: 0 })
        this.services.addInsurance(this.addInsurance.value).subscribe(data => {
          this.ResponseHelper.GetSuccessResponse(data);
          this.ToggleModal();
          this.saveDisabled=false
          this.getInsuranceDatas.emit();
        }, err => {
          this.saveDisabled=false
          this.ResponseHelper.GetFaliureResponse(err);
        })
      }

    }

  }


  ToggleModal() {
    this.selectedClientRow.Id = undefined
    this.ShowModal = false;
    this.Toggle.emit(this.ShowModal);
    this.clearForm();
  }


  clearForm() {
    this.showPopup = false
    this.validated = false;
    this.addInsurance.reset();
  }

  updateClientRow() {

    this.services.updateClientRow(this.selectedClientRow).pipe(finalize(() => {
    })).subscribe(
      res => {
        this.ResponseHelper.GetSuccessResponse(res);
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }
}

export class insuranceInfo {
  Id?: string;
  Practice_Name?: string;
  Insurance_Name_Gebbs?: string;
  Insurance_Code?: string;
  Insurance_State?: string;
  Financial_Class?: string;
  Timely_Filing_Limits_in_Days?: string;
  Appeal_Filing_Limit_In_Days?: string;
  Insurance_Name_for_Mail?: string;
  Claim_Mailing_Address1?: string;
  Claim_Mailing_Address2?: string;
  Claim_Mailing_City?: string;
  Claim_Mailing_State?: string;
  Claim_Mailing_Zipcode?: string;
  Claim_Mailing_ContactNo: string;
  Claim_Mailing_FaxNo?: string;
  Insurance_Name_for_Appeal?: string;
  Appeal_Mailing_Address1?: string;
  Appeal_Mailing_Address2?: string;
  Appeal_Mailing_City?: string;
  Appeal_Mailing_State?: string;
  Appeal_Mailing_Zipcode?: string;
  Appeal_Mailing_ContactNo?: string;
  Appeal_Mailing_FaxNo?; string;
  Website?: string;
  Client_Id?: string;
  Global_Insurance_Id?: string;
  Payer_Name?: string;
  Contact_Number?: string;
  Start_Time?: string;
  End_Time?: string;
  Fax_No?: string;
  Is_IVR?: string;
  Is_Voice?: boolean;
  Email_Id?: string;
  CSR_Fax?: string;
  Attention_To?: string;
  Global_Insurance_Added?: string;
  Claim_Mailing_Address?: string;
  Appeal_Mailing_Address?: string;
}
