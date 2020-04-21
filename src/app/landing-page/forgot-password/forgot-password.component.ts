import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"

import { ForgotPaswordService } from '../../service/forgot-pasword.service';
import { NotificationService } from 'src/app/service/notification.service';
import { customValidation } from 'src/app/manager/customValidators';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  providers: [ForgotPaswordService]
})
export class ForgotPasswordComponent implements OnInit {
  MyForm: FormGroup;
  ResetForm: FormGroup;
  DisplayError: Boolean;
  DisableSubmit: Boolean = false;
  SwitchToReset: Boolean = false;
  ResponseHelper
  constructor(private forgotpasswordservice: ForgotPaswordService, private notificationservice: NotificationService, private router: Router) { }


  ngOnInit() {
    this.CreateForm();
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }


  CreateForm() {
    this.MyForm = new FormGroup({
      username: new FormControl('', [Validators.required
      ])
    })
  }

  ForgotSubmit() {
    this.DisableSubmit = true;
    if (this.MyForm.valid) {
      this.DisplayError = false;
      this.forgotpasswordservice.ForgotPassword(this.MyForm.value).pipe(finalize(()=>{
        this.DisableSubmit = false;
      })).subscribe(
        data => {
          this.ResponseHelper.GetSuccessResponse(data)
          this.CreateResetForm();
          setTimeout(() => {
            this.SwitchToReset = true;
          }, 2000);
        }, err => {
          this.ResponseHelper.GetFaliureResponse(err)
        })
    }
    else {
      this.DisplayError = true;
      this.DisableSubmit = false;
    }
  }

  CreateResetForm() {

    this.ResetForm = new FormGroup({
      Username: new FormControl(this.MyForm.controls['username'].value, Validators.required),
      Temporary_Password: new FormControl('', [Validators.required
        , Validators.minLength(5), Validators.maxLength(5)
      ]),
      New_Password: new FormControl('', [Validators.required
        , Validators.minLength(8), Validators.maxLength(20)
      ]),
      confirmnewpass: new FormControl('', [Validators.required,
      ])
    }, { validators: customValidation.MatchPassword })
  }

  ResetPassword() {
    this.DisableSubmit = true;
    if (this.ResetForm.valid) {
      this.DisplayError = false;
      this.forgotpasswordservice.ResetPassword(this.ResetForm.value).subscribe(
        data => {
          this.ResponseHelper.GetSuccessResponse(data)
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);

        }, err => {
          this.ResponseHelper.GetFaliureResponse(err)
          this.DisableSubmit = false;

        })
    }
    else {
      this.DisplayError = true;
      this.DisableSubmit = false;
    }
  }

}
