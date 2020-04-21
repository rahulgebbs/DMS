import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"

import { LoginService } from '../../service/login.service';
import { Token } from '../../manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import { Notification } from 'src/app/manager/notification';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { RedirectHelper } from 'src/app/manager/redirect'
import { AnalyticsService } from 'src/app/analytics.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  MyForm: FormGroup;
  DisplayError: Boolean = false;
  DisableSubmit: Boolean = false;
  Token: Token;
  CurrentYear;
  ResponseHelper


  constructor(
    private loginservice: LoginService,
    private notificationservice: NotificationService,
    private RedirectHelper: RedirectHelper,
    private analyticsService: AnalyticsService,
    private router: Router) {

    this.CurrentYear = (new Date()).getFullYear();
  }

  ngOnInit() {
    // this.RedirectHelper = new RedirectHelper(this.router)
    this.createForm();
    this.Token = new Token(this.router);
    this.Token.ClearUserData();
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }

  logEvent() {
    this.analyticsService.logEvent('Login').subscribe((response) => {
      console.log('logEvent : ', response);
    }, (error) => {
      console.log('logEvent : ', error);
    });
  }
  FormSubmit() {
    this.DisableSubmit = true;
    if (this.MyForm.valid) {
      this.DisplayError = false;
      this.loginservice.Login(this.MyForm.value)
        .subscribe(
          data => {
            this.ResponseHelper.GetSuccessResponse(data)
            if (data.json().Data.Token != null) {


              setTimeout(() => {
                const response = data.json().Data;
                console.log('response : ', response)
                if (response.enableTFAuth && response.enableTFAuth.enable == true) {
                  localStorage.setItem('token', data.json().Data.Token);
                  sessionStorage.setItem("enableTFAuth", JSON.stringify(response.enableTFAuth));
                  this.router.navigate(['/two-factor-auth']);
                }
                else {
                  // this.router.navigate(['/Login']);
                  this.Token.SetLoginToken(data.json().Data.Token);
                  if (data.json().Data.First_Login == true) {
                    this.router.navigate(['/change-password']);
                  }
                  else {
                    this.RedirectHelper.redirectByRole()
                  }
                }
                this.logEvent();
                // this.Token.SetLoginToken(data.json().Data.Token);
                // this.RedirectHelper.redirectByRole();
              }, 2000);

            }
            else {
              let notify: Notification[] = [
                { Message: "Token Not Found", Type: "ERROR" }
              ];
              this.notificationservice.ChangeNotification(notify);
              this.DisableSubmit = false;
            }
          }, err => {
            this.ResponseHelper.GetFaliureResponse(err)
            this.DisableSubmit = false;
            this.analyticsService.logEvent('Login').subscribe((response) => {
              console.log('logEvent : ', response);
            }, (error) => {
              console.log('logEvent : ', error);
            });
          }
        );
    }
    else {
      this.DisplayError = true;
      this.DisableSubmit = false;
    }

  }

  createForm() {
    this.MyForm = new FormGroup({
      username: new FormControl('', [Validators.required
      ]),
      password: new FormControl('', [Validators.required
      ])
    })
  }

}
