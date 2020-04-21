import { Component, OnInit, OnDestroy } from '@angular/core';
import * as jwt_decode from "jwt-decode";
import { Router } from "@angular/router"
import { LoginService } from 'src/app/service/login.service';
import { qrCode } from './qrcode';
import { RedirectHelper } from 'src/app/manager/redirect';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-two-factor-auth',
  templateUrl: './two-factor-auth.component.html',
  styleUrls: ['./two-factor-auth.component.scss']
})
export class TwoFactorAuthComponent implements OnInit, OnDestroy {
  token = null;
  activeUser = null;
  URI = null;
  barCodeURI = null;
  passcode = null;
  // RedirectHelper: RedirectHelper;
  constructor(
    private router: Router,
    private loginService: LoginService,
    private RedirectHelper: RedirectHelper,
    private notification: NotificationService
  ) { }

  ngOnInit() {
    this.getTokenFromLocal();
    // this.RedirectHelper = new RedirectHelper(this.router)
  }

  getTokenFromLocal() {
    this.token = localStorage.getItem('token');
    const enableTFAuthStr = sessionStorage.getItem('enableTFAuth');
    console.log('token : ', this.token);
    if (this.token != null && this.token.length > 0) {
      this.activeUser = jwt_decode(this.token);
      this.activeUser.enableTFAuth = enableTFAuthStr ? JSON.parse(enableTFAuthStr) : null;
      const { enableTFAuth } = this.activeUser;
      console.log('After decode data : ', this.activeUser);
      if (enableTFAuth && enableTFAuth.status && enableTFAuth.status == 'incomplete') {
        this.getQRCode();
      }
      // else {
      //   this.router.navigate(['/login']);
      //   this.clearMe();
      // }
    }
    else {
      this.router.navigate(['/login']);
      this.clearMe();
    }
  }

  ngOnDestroy() {
    console.log('ngOnDestroy : ')
    localStorage.clear();
    sessionStorage.removeItem("enableTFAuth");
  }
  clearMe() {
    localStorage.clear();
    sessionStorage.removeItem("enableTFAuth");

  }
  getQRCode() {
    console.log('QR code API');
    this.loginService.getQRCode(this.activeUser.Email_Id).subscribe((response) => {
      console.log('getQRCode response : ', response);
      this.barCodeURI = response.Data.Html;
    }, (error) => {
      console.log('error : ', error)
    });

  }

  submit() {
    console.log('submit user : ', this.activeUser);
    if (this.passcode && this.passcode.length > 0) {
      this.loginService.matchOTP(this.passcode, this.activeUser.User_Id).subscribe((response) => {
        console.log('matchOTP response : ', response);
        if (response.Data == true) {
          this.notification.ChangeNotification([{ Message: "Passcode Verified", Type: "SUCCESS" }])
          this.navigateToDashboard();
        }
        else {
          // alert()
          // SUCCESS
          this.notification.ChangeNotification([{ Message: "InValid Passcode", Type: "ERROR" }])
        }

      }, (error) => {
        console.log('matchOTP error : ', error);

      })
    }

  }

  navigateToDashboard() {
    sessionStorage.setItem('access_token', this.token);
    localStorage.clear();
    if (this.activeUser.First_Login == true) {
      this.router.navigate(['/change-password']);
    }
    else {
      this.RedirectHelper.redirectByRole();
    }
  }


}
