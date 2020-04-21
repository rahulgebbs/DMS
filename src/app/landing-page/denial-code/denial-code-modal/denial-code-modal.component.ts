import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/service/common-service';
import { Token } from 'src/app/manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DenialCodeService } from './../../../service/denial-code.service';
import { dropDownFields } from 'src/app/manager/dropdown-feilds';

@Component({
  selector: 'app-denial-code-modal',
  templateUrl: './denial-code-modal.component.html',
  styleUrls: ['./denial-code-modal.component.css']
})
export class DenialCodeModalComponent implements OnInit {
  @Input() SelectedDenialCode: DenialCodeInfo = new DenialCodeInfo;
  @Input() onAdd: boolean;
  @Input() onEdit: boolean;
  @Output() Toggle = new EventEmitter<any>();
  @Output() getdenilcodeDatas = new EventEmitter<any>();
  ResponseHelper: ResponseHelper;
  UserId: number;
  ClientList = [];
  DenialCodeForm: FormGroup;
  Validated: boolean = false;
  ShowModal: boolean = true;
  saveDisabled: boolean = false;
  showPopup: boolean = false;
  ClientId;



  constructor(private selecetedFields:dropDownFields,private denialcodeservice: DenialCodeService, private fb: FormBuilder, private router: Router, private commonservice: CommonService, private notificationservice: NotificationService) {
    var token = new Token(this.router);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.ClientList = this.selecetedFields.setSelected(userdata.Clients);
    if(this.ClientList[0].selected){
      this.SelectedDenialCode.Client_Id = this.ClientList[0].Client_Id
      this.ClientId = this.ClientList[0].Client_Id
    }
    // this.selectedValue(this.ClientList)
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }

  ngOnInit() {

    // this.GetClientList();

    this.CreateDenialCodeForm();
    this.SelectedDenialCode;
  }

  selectedValue(data) {

    if (data.length == 1 && data.length) {
      data[0].selected = true;
      this.SelectedDenialCode.Client_Id = data[0].Client_Id
      this.ClientId = data[0].Client_Id
    } else {

    }

  }


  // GetClientList() {
  //   this.commonservice.GetClientList(this.UserId).pipe(finalize(() => {

  //   })).subscribe(
  //     data => {
  //       this.ClientList = data.json().Data;
  //       this.selectedValue(this.ClientList)
  //     },
  //     err => {
  //       this.ResponseHelper.GetFaliureResponse(err)
  //     }
  //   )
  // }

  onChange() {

    this.DenialCodeForm.controls['DenialCode'].reset();
    this.DenialCodeForm.controls['DenialDescirption'].reset();
    this.DenialCodeForm.controls['AMComments'].reset();
    this.DenialCodeForm.controls['DenialCodeId'].reset();

  }

  ToggleModal() {

    this.SelectedDenialCode.Denial_Code_Id = undefined;
    this.ShowModal = false;
    this.Toggle.emit(this.ShowModal);
    this.ClearForm();
  }


  CreateDenialCodeForm() {
    this.DenialCodeForm = this.fb.group({
      'ClientId': ['', Validators.required],
      'DenialCode': ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
      'DenialDescirption': ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
      'AMComments': ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
      'DenialCodeId': [''],
    })
  }

  ClearForm() {
    this.showPopup = false
    this.Validated = false;
    this.DenialCodeForm.reset();
  }


  SubmitDenialCodeForm() {
    this.Validated = true;

    if (this.DenialCodeForm.valid) {
      this.Validated = false;
      this.saveDisabled = true;

      if (this.SelectedDenialCode.Denial_Code_Id) {

        this.denialcodeservice.UpdateDenialCode(this.SelectedDenialCode).pipe(finalize(() => {
        })).subscribe(
          res => {
            this.ResponseHelper.GetSuccessResponse(res);
            this.ToggleModal();
            this.getdenilcodeDatas.emit()
            this.saveDisabled = false;
          },
          err => {
            this.ResponseHelper.GetFaliureResponse(err);
            this.saveDisabled = false
          }
        );
      }
      else {

        // this.DenialCodeForm.patchValue({ Denial_Code_Id: 0 })
        var objs = new Object();
        objs["Client_Id"] = this.DenialCodeForm.controls['ClientId'].value;
        objs["Denial_Code"] = this.DenialCodeForm.controls['DenialCode'].value;
        objs["Denial_Description"] = this.DenialCodeForm.controls['DenialDescirption'].value;
        objs["AM_Comments"] = this.DenialCodeForm.controls['AMComments'].value;
        // console.log(objs)
        this.denialcodeservice.SaveAllFields(objs).subscribe(data => {
          // console.log(data);
          this.ResponseHelper.GetSuccessResponse(data);
          this.ToggleModal();
          this.saveDisabled = false;
          this.getdenilcodeDatas.emit();
        }, err => {
          // console.log(err);
          this.saveDisabled = false;
          this.ResponseHelper.GetFaliureResponse(err);
        });
      }

    }
    else {
      this.Validated = true;
    }

  }

  UpdateDenialCode() {

    this.denialcodeservice.UpdateDenialCode(this.SelectedDenialCode).pipe(finalize(() => {
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


export class DenialCodeInfo {
  Denial_Code_Id?: number;
  Client_Id?: number;
  Denial_Code?: string;
  Denial_Description?: string;
  AM_Comments?: string;

}