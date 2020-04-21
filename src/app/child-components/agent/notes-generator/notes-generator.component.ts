import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-notes-generator',
  templateUrl: './notes-generator.component.html',
  styleUrls: ['./notes-generator.component.css']
})
export class NotesGeneratorComponent implements OnInit {
  @Output() CloseNotesGen = new EventEmitter<any>();
  NotesModel: NotesModel;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.NotesModel = new NotesModel();
  }

  Close() {
    this.CloseNotesGen.emit(false);
  }


  OnUserTypeChanged() {
    switch (this.NotesModel.UserType) {
      case "1":
      case "6":
        this.NotesModel.InsuranceName.IsActive = false;
        this.NotesModel.Phone.IsActive = false;
        this.NotesModel.OperatorName.IsActive = false;
        this.CreatePreview();
        break;
      case "2":
      case "3":
        this.NotesModel.InsuranceName.IsActive = true;
        this.NotesModel.Phone.IsActive = false;
        this.NotesModel.OperatorName.IsActive = false;
        break;
      case "4":
        this.NotesModel.InsuranceName.IsActive = true;
        this.NotesModel.Phone.IsActive = true;
        this.NotesModel.OperatorName.IsActive = false;
        break;
      case "5":
        this.NotesModel.InsuranceName.IsActive = true;
        this.NotesModel.Phone.IsActive = true;
        this.NotesModel.OperatorName.IsActive = true;
        break;
      default:
        this.NotesModel.InsuranceName.IsActive = false;
        this.NotesModel.Phone.IsActive = false;
        this.NotesModel.OperatorName.IsActive = false;
        break;
    }
  }

  ResetAllActiveStatus() {
    this.NotesModel.ClaimProcessDate.IsActive = false;
    this.NotesModel.AllowedAmount.IsActive = false;
    this.NotesModel.PaidAmount.IsActive = false;
    this.NotesModel.PtRespo.IsActive = false;
    this.NotesModel.ClaimPaidThrough.IsActive = false;
    this.NotesModel.BulkSingle.IsActive = false;
    this.NotesModel.CashedOutstanding.IsActive = false;
    this.NotesModel.OtherPayerResponse.IsActive = false;
    this.NotesModel.Claim.IsActive = false;
    this.NotesModel.ClaimReceiveDate.IsActive = false;
    this.NotesModel.ProcessingLimit.IsActive = false;
    this.NotesModel.WhenCallBack.IsActive = false;
    this.NotesModel.Fax.IsActive = false;
    this.NotesModel.TFLSubmitClaim.IsActive = false;
    this.NotesModel.ClaimDeniedDate.IsActive = false;
    this.NotesModel.ClaimRejectedDate.IsActive = false;
    this.NotesModel.ClaimRejectedReason.IsActive = false;
    this.NotesModel.EffectiveDate.IsActive = false;
    this.NotesModel.TerminationDate.IsActive = false;
    this.NotesModel.MailingAddress.IsActive = false;
    this.NotesModel.CallRefrence.IsActive = false;
    this.NotesModel.WhyClaimPending.IsActive = false;
  }

  SetAllActiveStatus() {
    this.NotesModel.ClaimProcessDate.IsActive = true;
    this.NotesModel.AllowedAmount.IsActive = true;
    this.NotesModel.PaidAmount.IsActive = true;
    this.NotesModel.PtRespo.IsActive = true;
    this.NotesModel.ClaimPaidThrough.IsActive = true;
    this.NotesModel.BulkSingle.IsActive = true;
    this.NotesModel.CashedOutstanding.IsActive = true;
    this.NotesModel.OtherPayerResponse.IsActive = true;
    this.NotesModel.Claim.IsActive = true;
    this.NotesModel.ClaimReceiveDate.IsActive = true;
    this.NotesModel.ProcessingLimit.IsActive = true;
    this.NotesModel.WhenCallBack.IsActive = true;
    this.NotesModel.Fax.IsActive = true;
    this.NotesModel.TFLSubmitClaim.IsActive = true;
    this.NotesModel.ClaimDeniedDate.IsActive = true;
    this.NotesModel.ClaimRejectedDate.IsActive = true;
    this.NotesModel.ClaimRejectedReason.IsActive = true;
    this.NotesModel.EffectiveDate.IsActive = true;
    this.NotesModel.TerminationDate.IsActive = true;
    this.NotesModel.MailingAddress.IsActive = true;
    this.NotesModel.CallRefrence.IsActive = true;
    this.NotesModel.WhyClaimPending.IsActive = true;
  }

  OnCallTypeChange() {
    this.ResetAllActiveStatus();
    switch (this.NotesModel.CallType) {
      case "1":
      case "4":
        this.NotesModel.ClaimProcessDate.IsActive = true;
        this.NotesModel.AllowedAmount.IsActive = true;
        this.NotesModel.PaidAmount.IsActive = true;
        this.NotesModel.PtRespo.IsActive = true;
        this.NotesModel.ClaimPaidThrough.IsActive = true;
        this.NotesModel.BulkSingle.IsActive = true;
        this.NotesModel.CashedOutstanding.IsActive = true;
        this.NotesModel.OtherPayerResponse.IsActive = true;
        this.NotesModel.Claim.IsActive = true;
        break;
      case "2":
        this.NotesModel.ClaimReceiveDate.IsActive = true;
        this.NotesModel.ProcessingLimit.IsActive = true;
        this.NotesModel.OtherPayerResponse.IsActive = true;
        this.NotesModel.WhenCallBack.IsActive = true;
        this.NotesModel.Claim.IsActive = true;
        break;
      case "3":
      case "5":
        this.NotesModel.ClaimReceiveDate.IsActive = true;
        this.NotesModel.ClaimDeniedDate.IsActive = true;
        this.NotesModel.OtherPayerResponse.IsActive = true;
        this.NotesModel.TFLSubmitClaim.IsActive = true;
        this.NotesModel.Fax.IsActive = true;
        this.NotesModel.Claim.IsActive = true;
        break;
      case "6":
        this.NotesModel.ClaimRejectedDate.IsActive = true;
        this.NotesModel.ClaimRejectedReason.IsActive = true;
        this.NotesModel.OtherPayerResponse.IsActive = true;
        this.NotesModel.Claim.IsActive = true;
        this.NotesModel.WhyClaimPending.IsActive = true;
        break;
      case "7":
        this.NotesModel.OtherPayerResponse.IsActive = true;
        break;
      case "8":
        this.NotesModel.ClaimReceiveDate.IsActive = true;
        this.NotesModel.ClaimDeniedDate.IsActive = true;
        this.NotesModel.OtherPayerResponse.IsActive = true;
        this.NotesModel.Claim.IsActive = true;
        break;
      case "9":
        this.NotesModel.EffectiveDate.IsActive = true;
        this.NotesModel.TerminationDate.IsActive = true;
        this.NotesModel.OtherPayerResponse.IsActive = true;
        this.NotesModel.TFLSubmitClaim.IsActive = true;
        this.NotesModel.MailingAddress.IsActive = true;
        this.NotesModel.Fax.IsActive = true;
        this.NotesModel.CallRefrence.IsActive = true;
        break;
      default:
        this.ResetAllActiveStatus();
        break;
    }
  }

  BlockInput(event) {
    if (event.key == 'Backspace' || event.key == 'Tab') {
      return true;
    }
    else {
      return false;
    }

  }

  CreatePreview() {
    let preanalysisdata = "";
    if (this.NotesModel.PreAnalysis != null) {
      preanalysisdata = this.NotesModel.PreAnalysis + " as per account review, ";
    }

    let Preview = ""; Preview += preanalysisdata;
    switch (this.NotesModel.UserType) {
      case "1":
        Preview += "as per analysis, ";
        break;
      case "2":
        Preview += "access " + this.NotesModel.InsuranceName.Value + "'s website, ";
        break;
      case "3":
        Preview += "analyze " + this.NotesModel.InsuranceName.Value + " EO, ";
        break;
      case "4":
        if (this.NotesModel.InsuranceName.Value != "") {
          Preview += "access " + this.NotesModel.InsuranceName.Value;
        }
        if (this.NotesModel.Phone.Value != "") {
          Preview += " IVR @ " + this.NotesModel.Phone.Value + ', ';
        }
        break;
      case "5":
        if (this.NotesModel.InsuranceName.Value != "") {
          Preview += "Cld " + this.NotesModel.InsuranceName.Value;
        }
        if (this.NotesModel.Phone.Value != "") {
          Preview += ", @ " + this.NotesModel.Phone.Value + ', ';
        }
        if (this.NotesModel.OperatorName.Value != "") {
          Preview += "S/w " + this.NotesModel.OperatorName.Value + ', ';
        }
        break;
      case "6":
        Preview += "as per email, ";
        break;
      default:
        Preview = "";
        break;
    }

    switch (this.NotesModel.CallType) {
      case "1":
      case "4":
        if (this.NotesModel.CallType == "1") {
          Preview += 'said Paid to Provider, ';
        }
        else {
          Preview += 'said Paid to Patient, ';
        }
        if (this.NotesModel.ClaimProcessDate.Value != "" && this.NotesModel.ClaimProcessDate.IsActive) {
          Preview += "Claim Processed on " + this.ConvertToDate(this.NotesModel.ClaimProcessDate.Value) + ', ';
        }
        if (this.NotesModel.AllowedAmount.Value != "" && this.NotesModel.AllowedAmount.IsActive) {
          Preview += "allowed amt $" + this.NotesModel.AllowedAmount.Value + ', ';
        }
        if (this.NotesModel.PaidAmount.Value != "" && this.NotesModel.PaidAmount.IsActive) {
          Preview += "Paid amt $" + this.NotesModel.PaidAmount.Value + ', ';
        }
        if (this.NotesModel.PtRespo.Value != "" && this.NotesModel.PtRespo.IsActive) {
          Preview += "pt respo " + this.NotesModel.PtRespo.Value + ', ';
        }
        if (this.NotesModel.ClaimPaidThrough.Value != "" && this.NotesModel.ClaimPaidThrough.IsActive) {
          Preview += "claim paid through " + this.NotesModel.ClaimPaidThrough.Value + ', ';
        }
        if (this.NotesModel.BulkSingle.Value != "") {
          Preview += "It's a " + this.NotesModel.BulkSingle.Value + ' chk , ';
        }
        if (this.NotesModel.CashedOutstanding.Value != "" && this.NotesModel.CashedOutstanding.IsActive) {
          Preview += "It's " + this.NotesModel.CashedOutstanding.Value + ', ';
        }
        if (this.NotesModel.OtherPayerResponse.Value != "" && this.NotesModel.OtherPayerResponse.IsActive) {
          Preview += this.NotesModel.OtherPayerResponse.Value + ', ';
        }
        if (this.NotesModel.Claim.Value != "" && this.NotesModel.Claim.IsActive) {
          Preview += "claim# " + this.NotesModel.Claim.Value + ', ';
        }
        break;
      case "2":
        Preview += 'said claim in process, ';
        if (this.NotesModel.ClaimReceiveDate.Value != "" && this.NotesModel.ClaimReceiveDate.IsActive) {
          Preview += "received on " + this.ConvertToDate(this.NotesModel.ClaimReceiveDate.Value) + ', ';
        }
        if (this.NotesModel.ProcessingLimit.Value != "" && this.NotesModel.ProcessingLimit.IsActive) {
          Preview += "Processing limit is " + this.NotesModel.ProcessingLimit.Value + ', ';
        }
        if (this.NotesModel.OtherPayerResponse.Value != "" && this.NotesModel.OtherPayerResponse.IsActive) {
          Preview += this.NotesModel.OtherPayerResponse.Value + ', ';
        }
        if (this.NotesModel.WhenCallBack.Value != "" && this.NotesModel.WhenCallBack.IsActive) {
          Preview += "need to call back after " + this.NotesModel.WhenCallBack.Value + ', ';
        }
        if (this.NotesModel.Claim.Value != "" && this.NotesModel.Claim.IsActive) {
          Preview += "claim# " + this.NotesModel.Claim.Value + ', ';
        }
        break;
      case "3":
      case "5":
        if (this.NotesModel.CallType == "3") {
          Preview += 'said Claim denied for, ';
        }
        else {
          Preview += 'said Claim is Pending for information, ';
        }
        if (this.NotesModel.ClaimReceiveDate.Value != "" && this.NotesModel.ClaimReceiveDate.IsActive) {
          Preview += "received on " + this.ConvertToDate(this.NotesModel.ClaimReceiveDate.Value) + ', ';
        }
        if (this.NotesModel.ClaimDeniedDate.Value != "" && this.NotesModel.ClaimDeniedDate.IsActive) {
          Preview += "claim denied on " + this.ConvertToDate(this.NotesModel.ClaimDeniedDate.Value) + ', ';
        }
        if (this.NotesModel.OtherPayerResponse.Value != "" && this.NotesModel.OtherPayerResponse.IsActive) {
          Preview += this.NotesModel.OtherPayerResponse.Value + ', ';
        }
        if (this.NotesModel.TFLSubmitClaim.Value != "" && this.NotesModel.TFLSubmitClaim.IsActive) {
          Preview += "TFL to submit claim is " + this.NotesModel.TFLSubmitClaim.Value + ', ';
        }
        if (this.NotesModel.Fax.Value != "" && this.NotesModel.Fax.IsActive) {
          Preview += "can submit the claim @fax # " + this.NotesModel.Fax.Value + ', ';
        }
        if (this.NotesModel.Claim.Value != "" && this.NotesModel.Claim.IsActive) {
          Preview += "claim# " + this.NotesModel.Claim.Value + ', ';
        }
        if (this.NotesModel.WhyClaimPending.Value != "" && this.NotesModel.WhyClaimPending.IsActive && this.NotesModel.CallType == "5") {
          Preview += "claim is pending due to " + this.NotesModel.WhyClaimPending.Value + ', ';
        }
        break;
      case "6":
        Preview += 'said Rejected, ';
        if (this.NotesModel.ClaimRejectedDate.Value != "" && this.NotesModel.ClaimRejectedDate.IsActive) {
          Preview += "claim rejected on " + this.ConvertToDate(this.NotesModel.ClaimRejectedDate.Value) + ', ';
        }
        if (this.NotesModel.ClaimRejectedReason.Value != "" && this.NotesModel.ClaimRejectedReason.IsActive) {
          Preview += "claim rejected due as " + this.NotesModel.ClaimRejectedReason.Value + ', ';
        }
        if (this.NotesModel.OtherPayerResponse.Value != "" && this.NotesModel.OtherPayerResponse.IsActive) {
          Preview += this.NotesModel.OtherPayerResponse.Value + ', ';
        }
        if (this.NotesModel.Claim.Value != "" && this.NotesModel.Claim.IsActive) {
          Preview += "claim# " + this.NotesModel.Claim.Value + ', ';
        }
        break;
      case "7":
        Preview += "Unable to reached adjuster/rep even supervisor,call transferred,to voice mail box,left standard voice mail,provided patient and provider details  " + this.NotesModel.OtherPayerResponse.Value + ', ';
        break;
      case "8":
        Preview += "said Pt Can't Ident, ";
        if (this.NotesModel.ClaimReceiveDate.Value != "" && this.NotesModel.ClaimReceiveDate.IsActive) {
          Preview += "received on " + this.ConvertToDate(this.NotesModel.ClaimReceiveDate.Value) + ', ';
        }
        if (this.NotesModel.ClaimDeniedDate.Value != "" && this.NotesModel.ClaimDeniedDate.IsActive) {
          Preview += "claim denied on " + this.ConvertToDate(this.NotesModel.ClaimDeniedDate.Value) + ', ';
        }
        if (this.NotesModel.OtherPayerResponse.Value != "" && this.NotesModel.OtherPayerResponse.IsActive) {
          Preview += this.NotesModel.OtherPayerResponse.Value + ', ';
        }
        if (this.NotesModel.Claim.Value != "" && this.NotesModel.Claim.IsActive) {
          Preview += "claim# " + this.NotesModel.Claim.Value + ', ';
        }
        break;
      case "9":
        Preview += "CNOF ";
        if (this.NotesModel.EffectiveDate.Value != "" && this.NotesModel.EffectiveDate.IsActive) {
          Preview += "Policy effective from " + this.ConvertToDate(this.NotesModel.EffectiveDate.Value) + ', ';
        }
        if (this.NotesModel.TerminationDate.Value != "" && this.NotesModel.TerminationDate.IsActive) {
          Preview += "Policy termed on " + this.ConvertToDate(this.NotesModel.TerminationDate.Value) + ', ';
        }
        if (this.NotesModel.OtherPayerResponse.Value != "" && this.NotesModel.OtherPayerResponse.IsActive) {
          Preview += this.NotesModel.OtherPayerResponse.Value + ', ';
        }
        if (this.NotesModel.TFLSubmitClaim.Value != "" && this.NotesModel.TFLSubmitClaim.IsActive) {
          Preview += "TFL to submit claim is " + this.NotesModel.TFLSubmitClaim.Value + ', ';
        }
        if (this.NotesModel.MailingAddress.Value != "" && this.NotesModel.MailingAddress.IsActive) {
          Preview += "submitted claim at " + this.NotesModel.MailingAddress.Value + ', ';
        }
        if (this.NotesModel.Fax.Value != "" && this.NotesModel.Fax.IsActive) {
          Preview += "can submit the claim @fax # " + this.NotesModel.Fax.Value + ', ';
        }
        if (this.NotesModel.CallRefrence.Value != "" && this.NotesModel.CallRefrence.IsActive) {
          Preview += "Call Ref# " + this.NotesModel.CallRefrence.Value + ', ';
        }
        break;
      default:
        Preview += "";
        break;
    }
    this.NotesModel.Preview = Preview;
    return Preview;
  }
  ConvertToDate(Value: any): string {
    let d = new Date(Value);
    return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
  }

  Generate() {
    this.CloseNotesGen.emit(this.NotesModel.Preview);
  }

  Clear() {
    this.NotesModel = new NotesModel();
  }


}

export class NotesModel {
  PreAnalysis = null;
  UserType = "";
  InsuranceName = { IsActive: false, Value: "" }
  Phone = { IsActive: false, Value: "" };
  OperatorName = { IsActive: false, Value: "" };
  CallType = "";
  ClaimProcessDate = { IsActive: false, Value: "" };
  ClaimReceiveDate = { IsActive: false, Value: "" };
  ClaimDeniedDate = { IsActive: false, Value: "" };
  ClaimRejectedDate = { IsActive: false, Value: "" };
  EffectiveDate = { IsActive: false, Value: "" };
  TerminationDate = { IsActive: false, Value: "" };
  ClaimRejectedReason = { IsActive: false, Value: "" };
  AllowedAmount = { IsActive: false, Value: "" };
  PaidAmount = { IsActive: false, Value: "" };
  PtRespo = { IsActive: false, Value: "" };
  ClaimPaidThrough = { IsActive: false, Value: "" };
  BulkSingle = { IsActive: false, Value: "" };
  CashedOutstanding = { IsActive: false, Value: "" };
  OtherPayerResponse = { IsActive: false, Value: "" };
  Claim = { IsActive: false, Value: "" };
  ProcessingLimit = { IsActive: false, Value: "" };
  WhenCallBack = { IsActive: false, Value: "" };
  TFLSubmitClaim = { IsActive: false, Value: "" };
  Fax = { IsActive: false, Value: "" };
  MailingAddress = { IsActive: false, Value: "" };
  CallRefrence = { IsActive: false, Value: "" };
  WhyClaimPending = { IsActive: false, Value: "" };
  Preview = "";
}