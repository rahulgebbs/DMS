import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { ClientService } from 'src/app/service/client-configuration/client.service';
import { Token } from 'src/app/manager/token';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { MenuMappingService } from 'src/app/menu-mapping.service';
import * as AllCommunityModules from "ag-grid-community";

@Component({
  selector: 'app-user-menu-mapping',
  templateUrl: './user-menu-mapping.component.html',
  styleUrls: ['./user-menu-mapping.component.css']
})
export class UserMenuMappingComponent implements OnInit {
  ResponseHelper: ResponseHelper;
  userData;
  token: Token;
  Title = 'User Menu Mapping';
  UserMenuForm: FormGroup;
  clientUserMenuObj = {};
  roleList = [
    { item_id: 1, item_text: 'Client Supervisor' },
    { item_id: 2, item_text: 'Client User' }
  ];
  userList = [];
  clientList = [];
  disablesubmit = false;
  selectedItems = null;
  menuList = [];
  menuMappingObj = {
    client: null,
    role: null,
    userList: null,
    menuList: null
  };
  clientSetting = {
    singleSelection: true,
    idField: 'Id',
    textField: 'Client_Name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    closeDropDownOnSelection: true,
    allowSearchFilter: true
  }
  roleSetting = {
    singleSelection: true,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    closeDropDownOnSelection: true,
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  }
  userListSetting = {
    singleSelection: true,
    idField: 'User_Id',
    textField: 'Username',
    selectAllText: 'Select All',
    closeDropDownOnSelection: true,
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  }
  addMenuModal = false;
  assignStatus = false;
  disableMenuStatus = true;
  rowData;
  columnDefs;
  gridOptions: any = {
    context: {
      componentParent: this
    },
    rowClassRules: {
      'highLight-row': function (params) {
        // console.log('highLight-row : ', params.data)
        return params.data.active == true;
      }
    },
    force: true
  };
  editField = false;
  activeClient = null;
  private gridApi;
  private gridColumnApi;
  public modules = AllCommunityModules;
  constructor(
    private clientService: ClientService,
    private menuMappingService: MenuMappingService,
    private router: Router,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();
    this.ResponseHelper = new ResponseHelper(this.notification);
  }

  ngOnInit() {
    this.getClientList();

    this.getMenuList();
    this.getAllUsersWithMenu();
    this.checkAssignMenu();
    this.columnDefs = [
      { headerName: 'Client Name', field: 'Client_Name' },

      { headerName: 'UserName', field: 'Username' },
      { headerName: 'Role', field: 'Role' },
      { headerName: 'Active', field: 'Is_Deactivated' }
    ];
  }
  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    console.log('HostListener : ', event);
  }

  getClientList() {
    this.menuMappingService.getClientList().subscribe((response: any) => {
      console.log('response : ', response);
      this.clientList = response.Data;
    }, (error) => {
      console.log('error : ', error);
      this.ResponseHelper.GetFaliureResponse(error)
    })
  }

  getAllUsersWithMenu() {

    console.log('this.rowData : ', this.rowData);
    this.menuMappingService.getAllUsersWithMenu().subscribe((response: any) => {
      this.rowData = response.Data;
      console.log('getAllUsersWithMenu response : ', response)
    }, (error) => {
      console.log('error: ', error);
      this.rowData = [];
    });
  }
  getUserList() {
    console.log('getUserList() : ', this.menuMappingObj);
    const { client, role } = this.menuMappingObj;

    if (client == null || role == null || client.length == 0 || role.length == 0) {
      this.resetUserList();
      return false;
    }

    this.menuMappingService.getUserList(client[0].Id, role[0].item_text).subscribe((response: any) => {
      console.log('response : ', response);
      this.userList = response.Data;
    }, (error) => {
      console.log('error : ', error);
      this.userList = [];
      this.ResponseHelper.GetFaliureResponse(error)
    });
    this.checkAssignMenu();
  }
  resetUserList() {
    this.menuMappingObj.userList = [];
    this.userList = [];
    this.checkAssignMenu();
  }

  getMenuList() {

    this.menuMappingService.getMenuList().subscribe((response: any) => {
      console.log('getMenuList response : ', response);
      this.menuList = response.Data;
    }, (error) => {
      console.log('getMenuList error : ', error)
      this.menuList = [];
      this.ResponseHelper.GetFaliureResponse(error)
    });
  }

  openAssignMenuModal() {
    console.log('openAssignMenuModal() : ', this.assignStatus);

    console.log('this.disableMenuStatus : ', this.disableMenuStatus);
    if (this.disableMenuStatus == true) {
      this.notification.ChangeNotification([{ Message: "Please select Client, Role and User List", Type: "ERROR" }]);
      this.checkAssignMenu();
      return true;
    }
    const { client, role, userList, menuList } = this.menuMappingObj;

    this.activeClient = JSON.parse(JSON.stringify({
      "Client_Id": client && client[0] ? client[0].Id : null,
      "Role_Name": role && role[0] ? role[0].item_text : null,
      "UsernameArr": userList ? userList.map((user) => user.Username) : [],
      menuList: this.menuList,
      "Menu_List_Ids": []
    }));
    this.assignStatus = true;
  }

  closeMenuModal(event) {
    console.log('closeMenuModal() : ', event);
    this.resetActiveMenu();
    this.rowData = JSON.parse(JSON.stringify(this.rowData));
    this.menuList.forEach((menu) => {
      delete menu.selected;
      delete menu.submenuList;
    });
    if (event == true) {
      this.getAllUsersWithMenu();
    }
    this.menuMappingObj = {
      client: null,
      role: null,
      userList: null,
      menuList: null
    }
    this.assignStatus = false;
    this.editField = false;
    this.resetFields();
  }

  resetFields() {
    this.menuMappingObj = {
      client: null,
      role: null,
      userList: null,
      menuList: null
    };
    /* reset user list*/
    this.userList = [];
  }

  onCellClicked(event) {
    console.log('onCellClicked event : ', event.data, this.rowData);
    /* reset dropdown fields*/
    this.resetFields();
    // this.resetActiveMenu();
    this.editField = true;
    const { Client_Id, Role, Username, menus } = event.data;

    this.activeClient = {
      "Client_Id": Client_Id,
      "Role_Name": Role,
      "UsernameArr": [Username],
      menuList: this.menuList,
      "Menu_List_Ids": menus
    }

    this.assignStatus = true;
    // console.log('gridOptions : ', this.gridOptions.api.getRowNode());
    this.gridOptions.api.forEachNode((rowNode) => {
      // console.log('rowNode : ', rowNode.data.User_Id, event.data.User_Id);
      if (rowNode.data.User_Id == event.data.User_Id) {
        event.data.active = true;
        rowNode.setData(event.data);
      }
      else {
        rowNode.data.active = false;
        rowNode.setData(rowNode.data);
      }
    });
    // this.rowData = JSON.parse(JSON.stringify(this.rowData));
  }

  resetActiveMenu() {
    this.rowData.forEach((ele) => {
      delete ele.active;
    });
    this.cdr.detectChanges();
    // var params = { force: true };
    // this.gridApi.refreshCells(params);
    this.rowData = JSON.parse(JSON.stringify(this.rowData));
  }
  checkAssignMenu() {
    const { client, role, userList } = this.menuMappingObj;
    console.log('client, role, userList : ', client, role, userList)
    if (client && role && userList) {
      if (client.length > 0 && role.length > 0 && userList.length > 0) {
        this.disableMenuStatus = false;
        return true;
      }
    }

    this.disableMenuStatus = true;
    return true;
  }

  OnGridReady(event) {

    // if (this.AccountsList != null) {
    var allColumnIds = [];
    event.columnApi.getAllColumns().forEach(function (column) {
      // console.log('column : ', column);
      // if (column.colId != "Role") return true;
      allColumnIds.push(column.colId);
    });
    event.columnApi.autoSizeColumns(allColumnIds);

    // var thisref = this;
    // event.api.forEachNode(function (node) {
    //   if (node.data.Inventory_Id == thisref.WorkingAccountId) {
    //     node.setSelected(true, true);
    //   }
    // });
    // }

  }
}
