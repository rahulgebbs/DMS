import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProviderService } from '../../../../service/client-configuration/provider.service'
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { finalize } from 'rxjs/operators';



@Component({
  selector: 'app-provider-model',
  templateUrl: './provider-model.component.html',
  styleUrls: ['./provider-model.component.css']
})
export class ProviderModelComponent implements OnInit {
  @Output() Toggle = new EventEmitter<any>();
  @Input() SelectedProvider
  @Input() EditPopup: boolean;
  @Output() getProvider = new EventEmitter<any>();
  validated
  saveDisabled: boolean = false
  ResponseHelper: ResponseHelper;
  editProvider: FormGroup;
  constructor(public fb: FormBuilder, private service: ProviderService, private notificationservice: NotificationService) {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }

  ngOnInit() {
    this.editProvider = this.fb.group({
      'Id': [],
      'Practice_Code': ['', [Validators.required, Validators.maxLength(100)]],
      'Practice_Name': ['', Validators.maxLength(100)],
      'Provider_Code': [, Validators.maxLength(50)],
      'Provider_Legal_LastName': ['', Validators.maxLength(100)],
      'Provider_Legal_FirstName': ['', [Validators.required, Validators.maxLength(100)]],
      'Provider_Type': ['', Validators.maxLength(100)],
      'Provider_Group_Name': ['', Validators.maxLength(100)],
      'TAX_ID': [, [Validators.pattern('^[0-9]*$')]],
      'Individual_NPI': [, [Validators.pattern('^[0-9]*$')]],
      'Group_NPI': [, [Validators.pattern('^[0-9]*$')]],
      'Medicare_PTAN': ['', Validators.maxLength(50)],
      'MID_TID_TPG': ['', Validators.maxLength(50)],
      'Physical_AddressLine1': ['', Validators.maxLength(100)],
      'Physical_AddressLine2': [, Validators.maxLength(100)],
      'Physical_City': [, Validators.maxLength(50)],
      'Physical_State': [, Validators.maxLength(50)],
      'Physical_Zip': [, Validators.maxLength(50)],
      'Physical_Phone': [, Validators.maxLength(50)],
      'Physical_Fax_No': [, Validators.maxLength(50)],
      'PayToAdd_AddressLine1': [, Validators.maxLength(100)],
      'PayToAdd_AddressLine2': [, Validators.maxLength(100)],
      'PayToAdd_City': [, Validators.maxLength(50)],
      'PayToAdd_State': [, Validators.maxLength(50)],
      'PayToAdd_Zip': [, Validators.maxLength(50)],
      'PayToAdd_Phone': [, Validators.maxLength(50)],
      'PayToAdd_Fax': [, Validators.maxLength(50)],
      'IsEnrolled_For_EDI': [],
      'Enrollment_Date': ['', Validators.required],
      'Line_of_Business': [, Validators.maxLength(100)],
      'Vendor_Name': [, Validators.maxLength(100)],
      'Enrollment_Helpdesk_Email': [, Validators.maxLength(50)],
      'Enrollment_Helpdesk_PH_No': [, Validators.maxLength(50)],
      'Contact_Person_Name': [, Validators.maxLength(100)],
      'Contact_Person_Address': [, Validators.maxLength(100)],
      'Contact_Person_CallBack_No': [, Validators.maxLength(50)],
      'Provider_Signature': [],

    })
  }
  ToggleModal() {
    this.Toggle.emit();
    this.editProvider.reset();
  }
  submitForm() {

    if (this.editProvider.valid && this.editProvider.value) {
      this.saveDisabled = true
      this.service.updateProvider(this.SelectedProvider).pipe(finalize(() => {
      })).subscribe(data => {

        this.ResponseHelper.GetSuccessResponse(data);
        this.saveDisabled = false
        this.ToggleModal();

        this.getProvider.emit();

        let res = data.json();

      }, err => {
        this.ResponseHelper.GetFaliureResponse(err)

      })
    }
  }


}
export class providerInfo {
  Id;
  Practice_Code;
  Practice_Name;
  Provider_Code;
  Provider_Legal_LastName;
  Provider_Legal_FirstName;
  Provider_Type;
  Provider_Group_Name;
  TAX_ID;
  Individual_NPI;
  Group_NPI;
  Medicare_PTAN;
  MID_TID_TPG;
  Physical_AddressLine1;
  Physical_AddressLine2;
  Physical_City;
  Physical_State;
  Physical_Zip;
  Physical_Phone;
  Physical_Fax_No;
  PayToAdd_AddressLine1;
  PayToAdd_AddressLine2;
  PayToAdd_City;
  PayToAdd_State;
  PayToAdd_Zip;

  //
  PayToAdd_Phone;
  PayToAdd_Fax;
  IsEnrolled_For_EDI;
  Enrollment_Date;
  //
  Line_of_Business;
  Vendor_Name;
  Enrollment_Helpdesk_Email;
  Enrollment_Helpdesk_PH_No;
  Contact_Person_Name;
  Contact_Person_Address;
  Contact_Person_CallBack_No;
  Provider_Signature;

}