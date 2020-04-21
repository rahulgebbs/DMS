import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges } from '@angular/core';
// import { EventEmitter } from 'events';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { Token } from 'src/app/manager/token';
import { Router } from '@angular/router';
import { MenuMappingService } from 'src/app/menu-mapping.service';
import * as RoleHelper from 'src/app/manager/role';

@Component({
  selector: 'app-assign-menu',
  templateUrl: './assign-menu.component.html',
  styleUrls: ['./assign-menu.component.scss']
})
export class AssignMenuComponent implements OnInit, OnChanges {
  ResponseHelper: ResponseHelper;
  @Output() close = new EventEmitter();
  @Input() client;
  subMenuSetting = {
    singleSelection: false,
    idField: 'Id',
    textField: 'Submenu_Name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true
  }
  httpStatus = false;
  Access = RoleHelper.Access;
  UserData = null;
  Token = null;
  accessMenuList = [];
  constructor(private menuMappingService: MenuMappingService,
    private route: Router,
    private notification: NotificationService) {
    this.ResponseHelper = new ResponseHelper(this.notification);
  }

  ngOnInit() {
    console.log('client : ', this.client);
    // this.CheckRole();
  }

  closeModal() {
    this.close.emit(null);
  }

  CheckRole() {
    this.accessMenuList = [];
    let routes = Object.keys(this.Access);
    console.log('routes : ', routes);
    routes.forEach(e => {
      if (this.Access[e].includes(this.client.Role_Name)) {
        this.accessMenuList.push(e);
      }
    });
    console.log('accessMenuList : ', this.accessMenuList, this.client);
  }

  checkMenuAccess(menuObj) {
    // let status = false;
    if (menuObj.Menu_Name == "BI reports") {
      return true;
    }
    if (menuObj && menuObj.subMenus && menuObj.subMenus.length > 0) {
      menuObj.subMenus.forEach((element, index) => {
        const result = this.accessMenuList.includes(element.Route);
        if (result == false) {
          menuObj.subMenus.splice(index, 1)
        }
      });
      // status = menuObj && menuObj.subMenus && menuObj.subMenus.length > 0 ? true : false;
      return true;
    }
    else {
      // console.log('In ELSE : ', menuObj);
      return this.accessMenuList.includes(menuObj.Route);
    }
  }
  ngOnChanges(changes) {
    console.log('ngOnChanges changes : ', changes);
    if (changes.client.currentValue !== changes.client.previousValue) {
      this.resetMenu();
      this.selectMenuForEdit();
      this.CheckRole();
    }
  }

  resetMenu() {
    // this.accessMenuList = [];
    this.client.menuList.forEach((menu) => {
      delete menu.selected;
      delete menu.submenuList;
    });
  }

  selectMenuForEdit() {

    if (this.client.Menu_List_Ids == null || this.client.menuList == null) {
      return false;
    }
    this.client.Menu_List_Ids.forEach((element) => {
      const result = this.client.menuList.find((menu) => {
        return menu.Id == element.Id;
      });
      if (result) {
        result.selected = true;
        if (result.subMenus.length > 0) {
          result.subMenuList = element.subMenus;
        }
      }
    });
  }

  submit() {
    this.httpStatus = true;
    const result = this.client.menuList.filter((menu) => menu.selected == true);
    console.log('result : ', result);
    const finalArray = [];
    result.forEach(element => {
      finalArray.push(element.Id);
      if (element.subMenuList == undefined) {
        return false;
      }
      element.subMenuList.forEach((subMenu) => {
        finalArray.push(subMenu.Id);
      })
    });
    if (finalArray && finalArray.length == 0) {
      this.notification.ChangeNotification([{ Message: "Please select AtLeast One Menu !", Type: "ERROR" }]);
      this.httpStatus = false;
      return false;
    }
    console.log('finalArray : ', finalArray);
    this.saveMenu(finalArray)
  }

  saveMenu(menuArray) {
    const finalObj = JSON.parse(JSON.stringify(this.client));
    delete finalObj.menuList;
    finalObj.Menu_List_Ids = menuArray;
    console.log('finalObj : ', finalObj);
    this.menuMappingService.saveMenuSubmenu(finalObj).subscribe((response) => {
      this.httpStatus = false;
      this.notification.ChangeNotification(response.Message);
      this.close.emit(true);
    }, (error) => {
      console.log('error : ', error);
      this.httpStatus = false;
      this.close.emit(true);
      this.ResponseHelper.GetFaliureResponse(error);
    });
  }

  manageCheckbox(menu) {
    console.log('manageCheckbox() : ', menu);
    menu.selected = menu.subMenuList && menu.subMenuList.length > 0 ? true : false;
  }
  enableCheckbox(menu) {
    console.log('enableCheckbox : ', menu);
    menu.subMenuList = menu.selected == true ? menu.subMenus : [];
  }
}
