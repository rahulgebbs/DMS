import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Token } from '../../manager/token';
import { Router } from "@angular/router"
import * as RoleHelper from 'src/app/manager/role';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { LogoutService } from './../../service/logout.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { AnalyticsService } from 'src/app/analytics.service';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ transform: 'translateX(-100%)' }),
        animate(200, style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(200, style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]

})
export class MenuComponent implements OnInit {
  @Input('MenuName') MenuName: string;
  @Input() DisplayMenu;
  @Output() Toggle = new EventEmitter<any>();
  UserData: Token;
  Access = RoleHelper.Access;
  RouteName;
  MenuList = [];
  ResponseHelper: ResponseHelper;
  User_Id: any;
  ClientId = 0;
  Client_Name = '';
  role;
  btndis: boolean = false
  biReportMenu = [];
  Token;
  clientUserMenuList = [];
  constructor(private notificationservice: NotificationService,
    private route: Router,
    private logoutService: LogoutService) {
    this.Token = new Token(this.route)
    this.UserData = this.Token.GetUserData();
    this.role = this.UserData.Role;
    this.ClientId = this.UserData.Clients[0].Client_Id;
    this.ResponseHelper = new ResponseHelper(this.notificationservice);

  }

  ngOnInit() {
    this.MenuList = [];
    this.CheckRole();
    this.initClient();
    this.UserData = this.Token.GetUserData();
    console.log('this.UserData : ', this.UserData);

    /*get menu for user*/
    this.getMenuForUser()
  }
  initClient() {
    var token = new Token(this.route);
    var userdata = token.GetUserData();
    console.log(userdata);
    this.ClientId = userdata.Clients[0].Client_Id;
    this.Client_Name = userdata.Clients[0].Client_Name;
  }
  CheckRole() {
    let routes = Object.keys(this.Access);
    // console.log('CheckRole routes : ',routes)
    routes.forEach(e => {
      if (this.Access[e].includes(this.UserData.Role)) {
        this.MenuList.push(e);
      }
    });
  }

  Logout() {

    this.LogoutFromSystem();

    this.btndis = false;
  }


  LogoutFromSystem() {
    var objs = new Object();
    this.User_Id = this.UserData.UserId;
    objs["Id"] = this.User_Id;
    this.logoutService.Logout(objs).subscribe(res => {
      this.Toggle.emit(false);
      setTimeout(() => {
        this.route.navigate(['/login']);
      }, 1000);
      this.ResponseHelper.GetSuccessResponse(res);
    },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }

  CloseMenu() {
    this.Toggle.emit(false);
  }

  OpenMenu(menu) {
    this.RouteName = menu;
    this.Toggle.emit(false);
    // if (subMenu.Route == 'bi-report') {
    //   this.openBIReport(subMenu);
    //   return false;
    // }
    this.route.navigate(['/' + menu]);
  }

  openDynamicMenu(subMenu) {
    this.RouteName = subMenu.Route;
    this.Toggle.emit(false);
    if (subMenu.Route == 'bi-report') {
      this.openBIReport(subMenu);
      return false;
    }
    this.route.navigate(['/' + subMenu.Route]);
  }

  openBIReport(reportObj) {
    this.RouteName = 'bi-report';
    this.Toggle.emit(false);
    this.route.navigate(['/bi-report', reportObj.Report_Name]);
    console.log('openBIReport : ', reportObj);
    // bi-report/:reportType
  }

  checkMenu(menuName) {
    // console.log('menuName : ', menuName);
    // const menus = ['bi-report'];
    // if (this.UserData.Role == 'Client Supervisor') {
    //   return menus.includes(menuName);
    // }
    // else if (this.MenuList.includes(menuName)) {
    //   return true;
    // }
    // else {
    //   return false
    // }
    return this.MenuList.includes(menuName);
  }

  getMenuForUser() {
    // this.menuService.getMenuForUser().subscribe((response) => {
    //   // console.log('getMenuForUser response : ', response);
    //   this.clientUserMenuList = response.Data;
    //   this.getBIReportMenu();
    // }, (error) => {
    //   console.log('error : ', error);
    //   this.getBIReportMenu();
    // })
  }

  matchedMenu(subMenus) {
    // console.log('matchedMenu subMenus : ', this.RouteName);
    const menu = subMenus.find((menuObj) => {
      return this.MenuName == '/' + menuObj.Route;
    })
    console.log('menu : ', menu);
    if (menu != undefined)
      return true;
    else
      return false;
  }
}
