import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Token } from '../app/manager/token';
import { NotificationService } from '../app/service/notification.service';
import { Router } from "@angular/router";
import * as RoleHelper from 'src/app/manager/role';
import { CommonService } from './service/common-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  token: Token;
  currentPage;
  event: Event;
  FirstLogin;
  uri;
  userRole;
  currentURI = window.location.origin;
  constructor(public router: Router, private service: NotificationService, private commonservice: CommonService) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    try {
      let page = next.data["route"];
      this.token = new Token(this.router);
      this.userRole = this.token.GetUserData();

      //uncommet this after verifying api op
      // for testing client functionality you need to comment line no 50 as this.router.navigate(['/login'])


      // // this.uri = this.commonservice.getUserURILookup();


      // this.commonservice.getUserURILookup().subscribe(res => {
      //   this.uri = res.json().Data

      //   if (this.userRole.Role == "Client Supervisor" || this.userRole.Role == "Client User") {
      //     if (this.uri.External == this.currentURI) {
      //       //  allow to access for cs and cu
      //     } else {
      //       let data = [{ Message: "You are not authorized.", Type: "ERROR" }]
      //       this.service.ChangeNotification(data)
      //       this.router.navigate(['/login'])
      //     }
      //   }
      //  else {
      //   if (this.uri.External == this.currentURI) {
      //     //  allow to access for cs and cu

      //     let data = [{ Message: "You are not authorized.", Type: "ERROR" }]
      //     this.service.ChangeNotification(data)
      //     this.router.navigate(['/login'])
      //   }
      // }
      // }, err => {
      //   this.service.ChangeNotification(err)
      // });

      if (this.token.Exists()) {

        // this.userRole =  this.token.GetUserData();
        this.FirstLogin = this.token.FirstLogin;
        if (page[0] != "change-password") {

          if (this.FirstLogin != false) {
            let data = [{ Message: "Please change your Password to visit this page", Type: "ERROR" }]
            this.service.ChangeNotification(data)
            this.router.navigate(['/login']);
          }
        }
        let Access = RoleHelper.Access;
        if (Access[page] == "All") {
          return true;
        }
        else {
          if (Access[page].includes(this.userRole.Role)) {
            return true
          } else {
            let data = [{ Message: "This Role is not allowed to visit this page", Type: "ERROR" }]
            this.service.ChangeNotification(data)
            this.router.navigate(['/login']);
            return false;
          }
        }
      }
      else {
        let data = [{ Message: "Please Login First.", Type: "ERROR" }]
        this.service.ChangeNotification(data)
        this.router.navigate(['/login']);
      }
    } catch (err) {
      let data = [{ Message: "Please Login First.", Type: "ERROR" }]
      this.service.ChangeNotification(data)
      this.router.navigate(['/login']);
    }
  }

}
