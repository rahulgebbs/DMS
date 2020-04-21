import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"

import { ChangePasswordService } from '../../service/change-password.service';
import { Token } from '../../manager/token';
import { customValidation } from '../../manager/customValidators';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  providers: [ChangePasswordService]
})
export class ChangePasswordComponent implements OnInit {
  title: string = "Reset Password";
  ChangeForm: FormGroup;
  DisplayError: Boolean;
  DisableSubmit: Boolean = false;
  Token: Token;
  UserId: number;
  ResponseHelper
  constructor(private ChangePasswordService: ChangePasswordService, private notificationservice: NotificationService, private router: Router) {
    this.Token = new Token(this.router);
   
      var data = this.Token.GetUserData();
      this.UserId = data.UserId;
  }


  ngOnInit() {
    this.createForm();
    this.ResponseHelper = new ResponseHelper(this.notificationservice);

  }

  createForm() {

    this.ChangeForm = new FormGroup({
      User_Id: new FormControl(this.UserId, [Validators.required]),
      Old_Password: new FormControl('', [Validators.required
        , Validators.minLength(8), Validators.maxLength(20)
      ]),
      New_Password: new FormControl('', [Validators.required
        , Validators.minLength(8), Validators.maxLength(20)
      ]),
      confirmnewpass: new FormControl('', [Validators.required,
        // ,Validators.minLength(8), Validators.maxLength(20)
      ]),
    }, { validators: customValidation.MatchPassword })
  }

  ChangePassword() {
    this.DisableSubmit = true;
    if (this.ChangeForm.valid) {
      this.DisplayError = false;
      this.ChangePasswordService.ChangePassword(this.ChangeForm.value)
        .subscribe(
          (data) => {
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
