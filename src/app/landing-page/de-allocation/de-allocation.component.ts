import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Token } from 'src/app/manager/token';
import { DeAllocationService } from 'src/app/service/de-allocation.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { FormGroup, FormBuilder } from '@angular/forms';
import {dropDownFields} from 'src/app/manager/dropdown-feilds'
@Component({
  selector: 'app-de-allocation',
  templateUrl: './de-allocation.component.html',
  styleUrls: ['./de-allocation.component.css'],
  providers:[dropDownFields]
})
export class DeAllocationComponent implements OnInit {
  title: string = "Supervisor Deallocation";
  AgentId = "";
  AgentListId;
  ClientListId
  ClientId = "";
  deallocationForm: FormGroup;
  UserId: number;
  ClientList: any[] = [];
  AgentList:any[]=[];
  bucketList;
  bucketId;
  bucket;
  selectedBucket;
  BucketName;
  validBucket: boolean = true;
  allDeallocate: boolean = false;
  clientid;
  validated
  ResponseHelper: ResponseHelper;
  token: Token;
  userdata;
  checkevent: boolean = false;
  isChecked;
  BucketList
  singleclient: boolean = false;
  constructor(private drpService:dropDownFields ,private router: Router, private deallocation: DeAllocationService, private notification: NotificationService, public fb: FormBuilder, ) {
    this.ResponseHelper = new ResponseHelper(this.notification);

    this.deallocationForm = this.fb.group({
      "AgentId": [],
      "ClientId": [],
      "BucketName": [],
      "isChecked": [],
    })
  }
  submitFrom() {
    this.deallocationForm.reset();

  }
  ngOnInit() {
    let token = new Token(this.router);
    this.userdata = token.GetUserData();
    this.UserId = this.userdata.UserId;
    this.ClientList = this.drpService.setSelected(this.userdata.Clients)
    if(this.ClientList[0].selected==true){
      this.ClientId = this.ClientList[0].Client_Id
      this.ClientSelectDropdown(event)
    }
   // this.selectedValue(this.ClientList)
  }


  selectedValue(data) {

    if (data.length == 1 && data.length) {
      data[0].selected = true;
      this.ClientId = data[0].Client_Id
      this.ClientSelectDropdown(event)
      this.singleclient = true
    } else {

    }
  }




  function(event) {
    if (event.target.checked) {
      this.checkevent = true
      this.validated = true;
      this.allDeallocate = true;
      this.deallocationForm.get('AgentId').disable()
      this.deallocationForm.get('BucketName').disable()
      this.deallocationForm.get('AgentId').reset();
      this.bucketList = []
    } else {
      this.checkevent = false
      this.deallocationForm.get('AgentId').enable()
      this.deallocationForm.get('BucketName').enable()
      this.validated = false;
      this.allDeallocate = false;
    }
  }

  ClientSelectDropdown(event) {
    

    this.ClientListId = this.ClientId
    //  this.ClientListId = this.deallocationForm.value.ClientId
    {
      this.AgentList=[];
      this.bucketList = []
      this.AgentListId=''
      this.deallocation.GetAgent(this.ClientListId).subscribe(data => {
        this.AgentList =this.drpService.setSelected( data.json().Data);
      }, err => {

        this.ResponseHelper.GetFaliureResponse(err);
      })
    }
  }

  AgentSelectDropdown(event) {
    this.checkevent = false
    this.bucketList = []
    this.AgentListId = this.deallocationForm.value.AgentId
    {
      this.deallocation.GetBucket(this.ClientListId, this.AgentListId).subscribe(data => {
        this.bucketList = data.json().Data
      }, err => {
        this.ResponseHelper.GetFaliureResponse(err);
      })
    }
  }
  BucketValid() {
    this.checkevent = true
    this.validated = true
  }

  resetValues() {
    if (!this.singleclient) {
      this.deallocationForm.reset({
        ClientId: "",
        AgentId: ""
      });
    } else {

      this.ClientListId
      this.deallocationForm.reset({

        ClientId: this.ClientListId,
        AgentId: ""
      });
      this.ClientId
    }

  }

  Deallocate(event) {
    if (this.allDeallocate) {
      this.validBucket = true;
      this.clientid = { Client_Id: this.ClientListId }
      this.deallocation.allDeallocate(this.clientid).subscribe(data => {
        this.ResponseHelper.GetSuccessResponse(data);
        this.deallocationForm.reset();
        this.resetValues();
        this.AgentList = []
        this.bucketList = []
        this.checkevent = false;
        this.isChecked = false
        this.deallocationForm.get('AgentId').enable()
        this.deallocationForm.get('BucketName').enable()
        if (this.singleclient) {
          this.ClientSelectDropdown(event)
        }
      }, err => {
        this.ResponseHelper.GetFaliureResponse(err);
      })
    } else {
      
      this.selectedBucket = this.deallocationForm.value.BucketName
      if (this.selectedBucket != undefined) {

        this.BucketList = {
          'Queue_List': []
        };
        for (let i = 0; i < this.selectedBucket.length; i++) {
          this.BucketList.Queue_List.push({
            'Queue_Name': this.selectedBucket[i]
          })
        }

        this.validated = true
        this.validBucket = true;
        
        this.bucket = { Client_Id: this.ClientListId, Agent_Id: this.AgentListId, Queue_List: this.BucketList.Queue_List }
        this.deallocation.Deallocate(this.bucket).subscribe(data => {
          this.ResponseHelper.GetSuccessResponse(data);
          this.deallocationForm.reset();
          this.resetValues();
          this.AgentList = []
          this.bucketList = []
          this.checkevent = false;
          this.isChecked = false
          if (this.singleclient) {
            this.ClientSelectDropdown(event)
          }

        }, err => {
          this.deallocationForm.reset();
          this.ResponseHelper.GetFaliureResponse(err);
        })
      }
      else {
        this.validated = false
        this.validBucket = false;
      }
    }

  }
}