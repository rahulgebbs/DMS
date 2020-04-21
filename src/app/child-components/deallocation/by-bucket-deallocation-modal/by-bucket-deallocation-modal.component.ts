import { Component, OnInit,Output, EventEmitter, Input} from '@angular/core';
import { v } from '@angular/core/src/render3';
import { Router } from '@angular/router';
import { Token } from 'src/app/manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { DeallocationByAgentByBucketService } from 'src/app/service/deallocation-by-agent-by-bucket.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-by-bucket-deallocation-modal',
  templateUrl: './by-bucket-deallocation-modal.component.html',
  styleUrls: ['./by-bucket-deallocation-modal.component.css']
})
export class ByBucketDeallocationModalComponent implements OnInit {
  @Input() AllBucket;
  @Input() AllEmployee;
  @Input() clientId;
  SelectAll = false;
  @Output() CloseModal = new EventEmitter<any>();
  dropdownList = [];
  //x
  selectedItems = [];
  dropdownSettings = {};
  checkevent:boolean=false;
  newarray=[];
  constructor(private DeallocationService: DeallocationByAgentByBucketService,private notification: NotificationService) {
    this.ResponseHelper = new ResponseHelper(this.notification);
   }
  selectedBucketName=[];
  selectedEmployeeName=[];
  SelectedBucketId;
  ResponseHelper: ResponseHelper;
  selectedClientId:Number;
  FinalBucketAndEmpList:any;

  filterEmp=[];

  ngOnInit() {
   this.CheckSelectAll()
  this.selectedClientId=this.clientId;
  this.filterEmployees(); 
  this.dropdownSettings = {
    singleSelection: false,
     idField:'EmpName_BucketName_UserId',
     textField:'Full_Name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: true,
    noDataAvailablePlaceholderText:'No emp Found'
  };

  }
  CheckSelectAll() {
    if (this.AllBucket.every(v => v.Is_Selected == true)) {
    
      this.SelectAll = true;
     
    }
    else {   
      this.SelectAll = false;
  
    }
  }
  Close() {
    this.CloseModal.emit(false);
  } 

  checkSelect(Id) {
    this.AllBucket[Id].Is_Selected = !this.AllBucket[Id].Is_Selected;
    if (this.AllBucket.every(v => v.Is_Selected == true)) {
      this.SelectAll = true;   
    }
    else {
      this.SelectAll = false;   
    }
 }
    SelectAllToggle(event) {
    if (event.currentTarget.checked) {
      if(this.selectedEmployeeName.length>0)
       {
        this.checkevent=true;
       }
      this.AllBucket.forEach(e => {
        e.Is_Selected = true;      
      });
    }
    else {
      this.AllBucket.forEach(e => {
        e.Is_Selected = false;        
      });
      this.checkevent=false;
    }
  }
filterEmployees() {
  _.forEach(this.AllBucket, (bucket) => {
    const employeeList = _.filter(this.AllEmployee, (employee) => {
      return bucket.Bucket_Name == employee.Bucket_Name
    })
    console.log('employeeList : ', employeeList);
    employeeList.forEach((employee) => {   
    })
   bucket.employeeList = employeeList;
    bucket.selectedEmployee = [];
  });
  console.log('filterEmployees this.AllEmployeeList : ', this.AllBucket);
}

  //deallocation
  allowDeallocate() {
    const result = _.flatten(_.map(this.AllBucket, 'selectedEmployee'));;
    console.log('allowDeallocate : ', result);
    return result.length > 0;
  }
  Deallocate(event) {   

    console.log('Deallocate this.AllBucket : ', _.map(this.AllBucket, 'selectedEmployee'));
    const finalEmployeeList = _.flatten(_.map(this.AllBucket, 'selectedEmployee'));
    console.log('finalBucketList : ', finalEmployeeList);  
   this.DeallocationService.DeallocateBucketWise(finalEmployeeList).subscribe(data => {       
    this.ResponseHelper.GetSuccessResponse(data);  
    this.selectedEmployeeName = [];    
    this.checkevent=false;   
     this.selectedEmployeeName = [];   
    this.FinalBucketAndEmpList=[]; 
      this.CloseModal.emit(false);   

  }, err => {
    this.ResponseHelper.GetFaliureResponse(err);
  })

  }
}
