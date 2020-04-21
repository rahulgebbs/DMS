import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Token } from 'src/app/manager/token';
import {dropDownFields} from 'src/app/manager/dropdown-feilds';
import { DeallocationByAgentByBucketService } from 'src/app/service/deallocation-by-agent-by-bucket.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-agent-deallocation',
  templateUrl: './agent-deallocation.component.html',
  styleUrls: ['./agent-deallocation.component.css'],
  providers:[dropDownFields]
})
export class AgentDeallocationComponent implements OnInit {
  title = "De-Allocation";
  AgentdeallocationForm:FormGroup;
  ClientList: any[] = [];
  userdata;
  UserId: number;
  ClientId="";
  showOptionButtons:boolean=false;
  ShowAgentModal:boolean=false;
  ShowBucketModal:boolean=false;
  BucketName = [];
  ResponseHelper: ResponseHelper;
  checkevent: boolean = false;
  validated;
  bucketList;
  empList;
  empName=[];
  GetEmployeeName;
  AllBucketByEmpList;

  checklist="";


  constructor(public fb:FormBuilder,private router: Router,private drpService:dropDownFields,private DeallocationService: DeallocationByAgentByBucketService,private notification: NotificationService) { 
       this.ResponseHelper = new ResponseHelper(this.notification);

   this.AgentdeallocationForm=this.fb.group({
["ClientId"]:[],
  ["checklist"]:[]
    });
  }
  ngOnInit() {
    let token = new Token(this.router);
    this.userdata = token.GetUserData();
    this.UserId = this.userdata.UserId;
    //this.ClientList = this.drpService.setSelected(this.userdata.Clients)
   this.ClientList = this.setSelectedDropdown(this.userdata.Clients)
    if(this.ClientList[0].selected==true){
      this.showOptionButtons=true;
      this.ClientId = this.ClientList[0].Client_Id
      this.ClientSelectDropdown(event)
    }
    //this.selectedValue(this.ClientList);
  }

  submitFrom() {
    this.AgentdeallocationForm.reset();
  }

  ClientSelectDropdown(event) {
    

    // this.ClientListId = this.ClientId
  
    // {
    //   this.AgentList=[];
    //   this.bucketList = []
    //   this.AgentListId=''
    //   this.deallocation.GetAgent(this.ClientListId).subscribe(data => {
    //     this.AgentList =this.drpService.setSelected( data.json().Data);
    //   }, err => {

    //     this.ResponseHelper.GetFaliureResponse(err);
    //   })
    // }
  }
//to display option button
ClientListOnChange(event) {
this.showOptionButtons=true;

if (!event.target.value || event.target.value == "0") {
  //this.DisableEmployeeSelect = true;
}
else {
  this.ClientId = event.target.value;
  this.GetBucketNames();
  this.GetEmpNames();
  //this.GetEmployeeNameByBucketAndClient();
 // this.DisableEmployeeSelect = false;

 
}
}

GetBucketNames() {
  this.bucketList = [];
  this.empList=[];
  this.DeallocationService.GetBucket(this.ClientId).subscribe(
    res => {
      this.bucketList = res.json().Data.Bucket_Info;
      this.empList = res.json().Data.Emp_Details_By_Bucket_Info;     
      this.bucketList.forEach(e => {
        e.Is_Selected = false;

      })
    },
    err => {
      this.ResponseHelper.GetFaliureResponse(err)
    }
  )
}

GetEmpNames()
{  
    this.GetEmployeeName = [];
    //this.empList=[];
    this.DeallocationService.GetEmployees(this.ClientId).subscribe(
      res => {
        this.GetEmployeeName = res.json().Data.Emp_Info;
        this.AllBucketByEmpList = res.json().Data.BucketName_By_EmpId_Info;
        this.GetEmployeeName.forEach(e => {
          e.Is_Selected = false;
  
        })
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err)
      }
    )
  
}
// GetEmployeeNameByBucketAndClient()
// {
//   this.empList=[];
//   this.DeallocationService.GetEmployeeNameByBucketAndClient(this.ClientId).subscribe(
//     res=>{
//       this.empList=res.json().Data;
//       this.empList.forEach(element => {
//         element.Is_Selected=false;
//       })
//     },
//     err=>{
//       this.ResponseHelper.GetFaliureResponse(err)
//     } 
//   )
// }

//display model

OpenByBucket(event)
{
//this.GetBucketNames();
 this.ShowBucketModal=true;
}
OpenByAgent(event)
{
  this.ShowAgentModal=true;
}
//close Modal
CloseBucketModal() {    
  this.ShowBucketModal = false;  
  this.ClientId="";
  this.checklist="";
  this.showOptionButtons=false;  
}
  CloseAgentModal()
  {    
    this.ShowAgentModal = false;  
    this.ClientId="";
    this.checklist="";
    this.showOptionButtons=false;  
  }
  BucketValid() {
    this.checkevent = true
    this.validated = true
  }
  
  setSelectedDropdown(data) {
    if (data && data.length >= 1) {
        data[0].selected = false
        return data
    } else {
        data[0].selected = true
        return data
    }
}
}
