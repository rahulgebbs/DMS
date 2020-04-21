import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Token } from 'src/app/manager/token';
import { SupervisorDashboardService } from 'src/app/service/supervisor-dashboard.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-supervisor-dashboard',
  templateUrl: './supervisor-dashboard.component.html',
  styleUrls: ['./supervisor-dashboard.component.css']
})
export class SupervisorDashboardComponent implements OnInit {
  userdata;
  UserId;
  ResponseHelper: ResponseHelper;
  ClientList: any[] = [];
  dashboard: FormGroup;
  ClientId = "";
  Client_Name = "";
  title = "Supervisor Dashboard";
  DisplayModal = false;
  dashboardItems;
  OpeningARdollars;
  OpeningARcount;
  Influx$$;
  Influxhash;
  PendingARdollars;
  PendingARcount;
  Productivity_Target;
  Allocated_Count;
  Allocated_$_Value;
  Staff_Allocated;
  Agents_Required;
  Shortfall;
  Completed_Accounts;
  Dollar_Addressed;
  poca;
  poda;
  Next_Account;
  ClientdataId;
  startdate;
  enddate;
  dates;
  Month;
  payerwise;
  date;
  IM_edits_count;
  IM_edits_data;
  uploaddate;
  udate;
  tdate;
  timeDiff;
  diffDays;
  uploadInventory_date;
  IMdates;
  Appeal_Follow_Up;
  To_Be_Appeal;
  TL_Deny;
  Client_Response;
  CEX_Uncollectible;
  disablebtn: boolean = true;
  Allocated_Accounts;
  DisplayModalIm = false;
  check;
  show: boolean = false;
  validation: boolean = false;
  nodata: boolean = false;
  AllocatedCountsData;

  constructor(private router: Router, private dash: SupervisorDashboardService, private notification: NotificationService, public fb: FormBuilder) {
    this.ResponseHelper = new ResponseHelper(this.notification);


    this.dashboard = this.fb.group({
      "ClientId": [],
      "Client_Name": [],
    })
  }

  ngOnInit() {
    let token = new Token(this.router);
    this.userdata = token.GetUserData();
    this.UserId = this.userdata.UserId;
    this.ClientList = this.userdata.Clients
    this.selectedValue(this.ClientList)
  }

  onClientChange(e) {
    this.nodata = false
    this.show = false
    this.disablebtn = false
    this.check = e.target.value

  }

  selectedValue(data) {

    if (data.length == 1 && data.length) {

      data[0].selected = true;
      this.ClientId = data[0].Client_Id
      this.disablebtn = false
      this.ClientdataId = this.ClientId
      this.selectedClient()
    } else {

    }

  }

  GetClientList() {

    this.dash.GetClientList(this.UserId).subscribe(
      data => {
        this.ClientList = data.json().Data;
        this.selectedValue(this.ClientList)
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    )
  }

  selectedClient() {

    this.ClientdataId = this.ClientId
    this.getDashboard()

    this.ClientList.forEach(e => {
      if (e.Client_Id == this.ClientId) {
        this.Client_Name = e.Client_Name
      }
    });

    this.disablebtn = true

  }
  getDashboard() {
      
    this.dash.GetDashboard(this.ClientdataId).subscribe(
      data => {
        this.dashboardItems = data.json().Data
        this.getData();
        this.show = true;
        this.getIMEdits();
        this.getAllocated_Counts();
        this.disablebtn = false

      },
      err => {

        this.show = false;
        this.nodata = true
        this.ResponseHelper.GetFaliureResponse(err);

      }
    )
  }


  getIMEdits() {

    this.dash.GetIMEdits(this.ClientdataId).subscribe(data => {
      this.IM_edits_data = data.json().Data
    },
      err => {
        this.IM_edits_data = []

      }

    )
  }

  getAllocated_Counts() {

    this.dash.getAllocated_Counts(this.ClientdataId).subscribe(data => {

      this.Allocated_Accounts = data.json().Data

    },
      err => {
        this.Allocated_Accounts = []
        this.ResponseHelper.GetFaliureResponse(err);
      }
    )
  }


  getData() {

    this.OpeningARdollars = this.dashboardItems.get_Response_Grid[0]
    this.OpeningARcount = this.dashboardItems.get_Response_Grid[1]
    this.Influx$$ = this.dashboardItems.get_Response_Grid[2]
    this.Influxhash = this.dashboardItems.get_Response_Grid[3]
    this.PendingARdollars = this.dashboardItems.get_Response_Grid[4]
    this.PendingARcount = this.dashboardItems.get_Response_Grid[5]
    this.Productivity_Target = this.dashboardItems.get_Response_Grid[6]
    this.Allocated_Count = this.dashboardItems.get_Response_Grid[7]
    this.Allocated_$_Value = this.dashboardItems.get_Response_Grid[8]
    this.Staff_Allocated = this.dashboardItems.get_Response_Grid[9]
    this.Agents_Required = this.dashboardItems.get_Response_Grid[10]
    this.Shortfall = this.dashboardItems.get_Response_Grid[11]
    this.Completed_Accounts = this.dashboardItems.get_Response_Grid[12]
    this.Dollar_Addressed = this.dashboardItems.get_Response_Grid[13]
    this.poca = this.dashboardItems.get_Response_Grid[14]
    this.poda = this.dashboardItems.get_Response_Grid[15]
    this.Next_Account = this.dashboardItems.get_Response_Grid[16]
    this.Appeal_Follow_Up == this.dashboardItems.get_Response_Grid[17]
    this.To_Be_Appeal == this.dashboardItems.get_Response_Grid[18]
    this.TL_Deny == this.dashboardItems.get_Response_Grid[19]
    this.Client_Response == this.dashboardItems.get_Response_Grid[20]
    this.CEX_Uncollectible == this.dashboardItems.get_Response_Grid[23]
    this.payerwise = this.dashboardItems.Group_By
    this.date = this.dashboardItems.Latest_Inventory_Uploaded_On
    this.IM_edits_count = this.dashboardItems.IM_Edits_Count
    this.time()
    this.disablebtn = true
  }



  time() {

   this.date = this.dashboardItems.Latest_Inventory_Uploaded_On

   this.uploaddate = moment(this.date).format('MM/DD/YYYY');
  
  var startDate = new Date(this.uploaddate);
var endDate = new Date();
this.uploadInventory_date  = this.getBusinessDatesCount(startDate,endDate);


  }
   getBusinessDatesCount(startDate, endDate) {
    var count = 0;
    var curDate = startDate;
    while (curDate <= endDate) {
        var dayOfWeek = curDate.getDay();
        if(!((dayOfWeek == 6) || (dayOfWeek == 0)))
           count++;
        curDate.setDate(curDate.getDate() + 1);
    }
    return count;
}

  onImedit() {
    this.DisplayModalIm = true;
  }

  function(a) {

    this.AllocatedCountsData = this.Allocated_Accounts[a].allocated_Counts
    this.DisplayModal = true;
  }
  ToggleModal() {
    this.DisplayModal = false;
    this.DisplayModalIm = false;
  }

}
