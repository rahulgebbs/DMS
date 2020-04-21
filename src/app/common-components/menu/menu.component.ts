import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Token } from '../../manager/token';
import { Router } from "@angular/router"
import * as RoleHelper from 'src/app/manager/role';
import { defaultGroupComparator } from 'ag-grid-community';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { LogoutService } from './../../service/logout.service';
import { finalize } from 'rxjs/operators';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { AgentService } from 'src/app/service/agent.service';
import { BireportService } from 'src/app/service/bireport.service';
import { AnalyticsService } from 'src/app/analytics.service';
import { MenuMappingService } from 'src/app/menu-mapping.service';



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
    private analyticsService: AnalyticsService,
    private elementRef: ElementRef,
    private menuService: MenuMappingService,
    private bireportService: BireportService,
    private logoutService: LogoutService,
    private agentservice: AgentService) {
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
    // this.getBIReportMenu();
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
    this.analyticsService.logOutEvent('Login/Logout').subscribe((response) => {
      console.log('logEvent : ', response);
    }, (error) => {
      console.log('logEvent : ', error);
    });
    this.btndis = true
    if (this.route.url == '/agent') {
      var logId = 0;
      if (sessionStorage.length > 1) {
        var acc = JSON.parse(sessionStorage.getItem('Accounts'))
        if (acc && acc.length != 0) {
          acc.forEach(e => {
            if (e.Processed == 'Working') {
              logId = e.Inventory_Log_Id;
            }
          });
        }
        if (logId != 0) {
          this.EndCurrentAccount(logId);
        }
        else {
          this.LogoutFromSystem();
        }
      }
      else {
        this.LogoutFromSystem();
      }

    }
    else if (this.route.url == '/supervisor-agent') {
      var LogDetails;
      if (sessionStorage.length > 1) {
        LogDetails = JSON.parse(sessionStorage.getItem('WorkingLog'));
        this.ClientId = LogDetails.Client_Id;
        var Inventory_Log_Id = LogDetails.Inventory_Log_Id;
        this.EndCurrentAccount(Inventory_Log_Id);
      }
      else {
        this.LogoutFromSystem();
      }
    }
    else {
      this.LogoutFromSystem();
    }


    this.btndis = false
  }

  EndCurrentAccount(logId) {
    var formobj = {
      Client_Id: this.ClientId,
      Inventory_Log_Id: logId
    }
    this.agentservice.InsertEndTimeOfInventory(formobj).subscribe(
      res => {
        sessionStorage.removeItem("Accounts");
        this.LogoutFromSystem();
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
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

  getBIReportMenu() {
    console.log('this.biReportMenu : ', this.biReportMenu);
    let formbody = { "Client_Id": this.ClientId, "Client_Name": this.Client_Name };
    console.log('formbody : ', formbody, this.Client_Name, this.ClientId);
    this.bireportService.GetBiReport(formbody).subscribe((response) => {
      const json = response.json();
      this.biReportMenu = json.Data;
      console.log('biReportMenu json : ', this.biReportMenu, this.clientUserMenuList);
      if (this.biReportMenu) {
        this.clientUserMenuList.forEach((element) => {
          if (element.Menu_Name == "BI reports") {
            let obj = {};
            // {Id: 5, Submenu_Name: "client instruction report", Route: "client-instruction-report"}
            this.biReportMenu.forEach((biMenu) => {
              obj = { Id: Math.random() * 1000, Report_Name: biMenu.Menu_Name, Submenu_Name: biMenu.Menu_Name, Route: "bi-report" };
              element.subMenus.push(obj)
            });
            // const obj = {
            //   Client_Id: 9,
            //   Report_Name: "KYI",
            //   Menu_Name: "KYI"
            // }
            console.log('obj : ', obj);
          }
        });
      }
    }, (error) => {
      console.log('error : ', error);
    });
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
    this.menuService.getMenuForUser().subscribe((response) => {
      // console.log('getMenuForUser response : ', response);
      this.clientUserMenuList = response.Data;
      this.getBIReportMenu();
    }, (error) => {
      console.log('error : ', error);
      this.getBIReportMenu();
    })
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
