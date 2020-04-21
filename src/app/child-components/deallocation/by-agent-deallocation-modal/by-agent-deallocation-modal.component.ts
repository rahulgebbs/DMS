import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Token } from 'src/app/manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { DeallocationByAgentByBucketService } from 'src/app/service/deallocation-by-agent-by-bucket.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-by-agent-deallocation-modal',
  templateUrl: './by-agent-deallocation-modal.component.html',
  styleUrls: ['./by-agent-deallocation-modal.component.css']
})
export class ByAgentDeallocationModalComponent implements OnInit,OnChanges {

  @Input() AllEmployeeList;
  @Input() AllBucketByEmp;
  @Input() clientId;
  SelectAll = false;
  @Output() CloseModal = new EventEmitter<any>();
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  checkevent: boolean = false;
  constructor(private DeallocationService: DeallocationByAgentByBucketService, private notification: NotificationService) {
    this.ResponseHelper = new ResponseHelper(this.notification);
  }
  selectedBucketName = [];
  selectedEmployeeName = [];
  SelectedBucketId;
  ResponseHelper: ResponseHelper;
  selectedClientId: Number;
  FinalBucketAndEmpList: any;
  checkboxcheck: string;
  checkvalue = [];
  newarray = [];
  filterEmp_Never_Touched_Voice_List = [];

ngOnChanges(){
  console.log('AllEmployeeList,AllBucketByEmp,clientId : ',this.AllEmployeeList,this.AllBucketByEmp,this.clientId);
}

  ngOnInit() {
    this.CheckSelectAll()
    console.log(this.AllEmployeeList)
    console.log(this.AllEmployeeList)

    this.selectedClientId = this.clientId;
    this.filterEmployees();

    this.dropdownSettings = {
      singleSelection: false,

      idField: 'userbucket',
      textField: 'BucketName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'No bucket Found'
    };
  }
  CheckSelectAll() {
    if (this.AllEmployeeList && this.AllEmployeeList.every(v => v.Is_Selected == true)) {
      this.SelectAll = true;
    }
    else {
      this.SelectAll = false;
    }
  }
  Close() {
    this.CloseModal.emit(false);
  }
  checkSelect(ev: any, val: any, ind: any) {
    console.log(ev);
    if (this.checkboxcheck == "true") {
      if (ev.target.checked == true) {
        this.AllEmployeeList[ind].Is_Selected = "checked";
      }
      else {
        this.AllEmployeeList[ind].Is_Selected = false;
      }

    }
    else {
      if (this.checkvalue[ind] == true || this.checkvalue[ind] == "checked")
        this.AllEmployeeList[ind].Is_Selected = "checked"
      else
        this.AllEmployeeList[ind].Is_Selected = false;
    }
    console.log(this.AllEmployeeList)
    this.checkboxcheck = "true"
  }
  SelectAllToggle(event) {
    if (event.currentTarget.checked) {
      if (this.selectedEmployeeName.length > 0) {
        this.checkevent = true;
      }
      this.AllEmployeeList.forEach(e => {
        e.Is_Selected = true;
      });
    }
    else {
      this.AllEmployeeList.forEach(e => {
        e.Is_Selected = false;
      });
      this.checkevent = false;
    }
  }  

  filterEmployees() {
    _.forEach(this.AllEmployeeList, (employee) => {
      const bucketList = _.filter(this.AllBucketByEmp, (bucket) => {
        return bucket.user_Id == employee.Id
      })
      console.log('bucketList : ', bucketList);
      bucketList.forEach((bucket) => {
        bucket.userbucket = bucket.BucketName + '-' + employee.Id + '-' + this.clientId;
      })
      employee.bucketList = bucketList;
      employee.selectedBucket = [];
    });
    console.log('filterEmployees this.AllEmployeeList : ', this.AllEmployeeList);
  }

  allowDeallocate() {
    const result = _.flatten(_.map(this.AllEmployeeList, 'selectedBucket'));;
    console.log('allowDeallocate : ', result);
    return result.length > 0;
  }
  Deallocate(event) {

    console.log('Deallocate this.AllEmployeeList : ', _.map(this.AllEmployeeList, 'selectedBucket'));
    const finalBucketList = _.flatten(_.map(this.AllEmployeeList, 'selectedBucket'));
    console.log('finalBucketList : ', finalBucketList);
    this.DeallocationService.DeallocateEmployeeWise(finalBucketList).subscribe(data => {
      this.ResponseHelper.GetSuccessResponse(data);
      this.selectedEmployeeName = [];
      this.checkevent = false;
      this.selectedEmployeeName = [];
      this.FinalBucketAndEmpList = [];
      this.CloseModal.emit(false);
    }, err => {
      this.ResponseHelper.GetFaliureResponse(err);
    })

  }

}
