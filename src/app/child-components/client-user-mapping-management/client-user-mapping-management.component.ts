import { Component, OnInit } from '@angular/core';
import { Token } from 'src/app/manager/token';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Router } from '@angular/router';

import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddClientUserMappingManagementComponent } from './add-client-user-mapping-management/add-client-user-mapping-management.component';
import { ClientService } from 'src/app/service/client-configuration/client.service';


@Component({
  selector: 'app-client-user-mapping-management',
  templateUrl: './client-user-mapping-management.component.html',
  styleUrls: ['./client-user-mapping-management.component.scss']
})
export class ClientUserMappingManagementComponent implements OnInit {
  addModal = null;
  editModal = null;
  deleteModal = null;
  list = [];
  columnData = [];
  backupList = [];
  dropdownSettings = {};
  token;
  userData;
  activeUser = null;
  fetchingList = false;
  status = true;
  p: number = 0;
  ResponseHelper: ResponseHelper;

  constructor(private router: Router,
    private notificationService: NotificationService,
    // private modalService: NgbModal,
    private clientService: ClientService,
    // public activeModal: NgbActiveModal,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      maxHeight: 120,
      allowSearchFilter: true,
      defaultOpen: true
    };
    this.getList();
    this.columnData = [
      {
        "key": "Process_Name",
        "name": "Process Name"
      },
      {
        "key": "Name",
        "name": "Assigned Name"
      },
      {
        "key": "ECN",
        "name": "Assigned ECN"
      },
      {
        "key": "CitrixId",
        "name": "Citrix Id"
      },
      {
        "key": "Software_Id",
        "name": "Software Id"
      },
      {
        "key": "FOB_cerner",
        "name": "FOB Cerner"
      },
      {
        "key": "ClearingHouseId",
        "name": "Clearing House Id"
      },
      {
        "key": "Original_ECN",
        "name": "Original ECN"
      }, {
        "key": "ClearingHouseName",
        "name": "Clearing House Name"
      }, {
        "key": "CK",
        "name": "CK"
      }, {
        "key": "OWN",
        "name": "OWN"
      },
      {
        "key": "Userstatus",
        "name": "User Status"
      }
    ];
    console.log('ngOnInt : ', this.list);
  }
  openAddMappingModal() {
    console.log('openAddMappingModal : ');
    this.addModal = { random: Math.random() };
  }
  openEditMappingModal(user) {
    console.log('openEditMappingModal : ', user);
    this.editModal = { random: Math.random() };
    this.activeUser = user;
    
  }
  openDeleteMappingModal(user) {
    console.log('openDeleteMappingModal : ');
    this.deleteModal = { random: Math.random() };
    this.activeUser = user;
  }
  /**
   * 
   * @param modalName 
   */
  closeModal(modalName) {
    console.log('closeModal : ', modalName);
    this.getList();
    switch (modalName) {
      case 'add-modal':
        this.addModal = null;
        break;
      case 'edit-modal':
        this.editModal = null;
      case 'delete-modal': {
        this.deleteModal = null;
        break;
      }
      default:
        break;
    }

  }

  closeDeleteModal(event) {
    console.log('closeDeleteModal event : ', event);
    this.deleteModal = null;
    if (event == false) {
      this.activeUser.isActive = true;
    }
    else {
      this.getList();
    }
  }

  filterList(column) {
    const checkAllClear = this.allClear();
    if (checkAllClear == undefined) {
      this.list = this.backupList;
      column.openFilter = false;
      return false;
    }
    if (column.filterModel == null || column.filterModel.length == 0) {
      column.openFilter = false;
      return null;
    }
    else {
      this.list = this.backupList;
    }
    this.resetAllFilterModel(column);

    let array = []
    _.forEach(this.list, (element) => {
      let matchedresult = null;
      _.forEach(column.filterModel, (filter) => {
        if (element[column.key] == filter.item_text) {
          matchedresult = element;
        }
      });
      if (matchedresult) {
        array.push(matchedresult)
      }

    });
    this.list = array;
    this.p = 0;
    column.openFilter = false;
    event.stopPropagation();
  }

  resetAllFilterModel(currentColumn) {
    this.columnData.forEach((column) => {
      if (column.key != currentColumn.key) {
        column.filterModel = [];
      }
    });
  }

  filterKeys() {
    this.backupList = this.list;
    this.getUnqiueKeys();
  }

  getUnqiueKeys() {
    let keysArray = [];
    _.forEach(this.list, (element) => {
      const keys = _.keys(element);
      keysArray = _.merge(keysArray, keys);
    });
    this.columnData.forEach((column) => {
      const filterValues = _.map(this.list, column.key);
      let newList = [];
      filterValues.forEach((element, index) => {
        if (element && element.length > 0) {
          newList.push({ item_id: index, item_text: element })
        }
      });
      column.filterModel = [];
      column.filterList = _.uniqBy(newList, 'item_text');
      column.sorting = false;
    });
  }

  toggleMenu(column) {
    column.openFilter = !column.openFilter;
    event.stopPropagation();
  }

  sortBy(column) {
    column.sorting = !column.sorting;
    const sortOrder = column.sorting == true ? 'desc' : 'asc';
    const result = _.orderBy(this.list, (element) => {
      return element[column.key];
    }, sortOrder);
    this.list = result;
    event.stopPropagation();
  }
  allClear() {
    const result = _.find(this.columnData, (column) => {
      return column.filterModel.length > 0;
    });
    return result;
  }

  closeFilterModal(column) {
    column.openFilter = false;
  }

  getList() {
    this.fetchingList = true;
    this.clientService.clientUserMapping(this.userData.TokenValue).subscribe((response: any) => {
      console.log('clientUserMapping : ', response);
      this.list = response.Data;
      // this.list.splice(0, 780);
      this.filterKeys();
      this.fetchingList = false;
    }, (error) => {
      console.log('clientUserMapping error: ', error);
      this.fetchingList = false;

    });
  }

  toogleActivate(user) {
    console.log('toogeActivate(isActive) : ', user);
    if (user.isActive == false) {
      this.openDeleteMappingModal(user);
    }
    else {
      this.clientService.deleteECNUser(this.userData, user, true).subscribe((response) => {
        console.log('deleteECNUser response : ', response);
        // this.Res
        this.notificationService.ChangeNotification(response.Message);
        this.getList();
      }, (error) => {
        console.log('deleteECNUser error : ', error);
        this.ResponseHelper.GetFaliureResponse(error);
      })
    }
  }
}
