import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common-service';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { Token } from 'src/app/manager/token';
import { ClientAssistanceService } from 'src/app/service/client-assistance.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-client-assistance',
  templateUrl: './client-assistance.component.html',
  styleUrls: ['./client-assistance.component.css']
})
export class ClientAssistanceComponent implements OnInit {

  Title = "Client Assistance";
  ClientList = [];
  UserId = 0;
  ClientId = 0
  SelectedStatus = '';
  PopupHeader = '';
  StatusCount = 0;
  ShowInventories = false;
  DisableSearch = false;
  ShowAging = false;
  ShowMain = false;
  MinDate: Date;
  FromDate: Date;
  ToDate: Date;
  Action = "Done";
  ActionList = [
    { Key: "Pending For Approval", Value: "Done" },
    { Key: "TL Deny", Value: "Deny" },
    { Key: "Client Close", Value: "Close" },
    { Key: "Gebbs Closed", Value: "Gebbs Close" },
    { Key: "Client Hold", Value: "Hold" },
    { Key: "Sent To Client", Value: "Approve" }
  ];
  // "Done", "Approve", "Deny", "Gebbs Close", "SAAG Change"];
  ResponseHelper: ResponseHelper;
  Statuses = [];
  Summary;
  AgingData = [];
  SelectedAging;
  Inventories = [];
  constructor(private router: Router, private commonservice: CommonService, private notification: NotificationService, private service: ClientAssistanceService) { }

  ngOnInit() {
    
    var tk = new Token(this.router);
    var userdata = tk.GetUserData();
    this.UserId = userdata.UserId;
    this.ClientList=userdata.Clients
    if (this.ClientList.length == 1) {
      this.ClientId = this.ClientList[0].Id;
    }
    this.ResponseHelper = new ResponseHelper(this.notification);
    this.MinDate = new Date('01/01/2000');
 //   this.GetClientList();
  }

  // GetClientList() {
  //   this.commonservice.GetClientList(this.UserId).subscribe(
  //     data => {

  //       this.ClientList = data.json().Data;
  //       if (this.ClientList.length == 1) {
  //         this.ClientId = this.ClientList[0].Client_Id;
  //       }
  //     },
  //     err => {
  //       this.ResponseHelper.GetFaliureResponse(err)
  //     }
  //   )

  // }

  OnActionChange() {
    this.ResetPage();
  }

  FromDateOnChange() {
    this.ResetPage();
  }

  ToDateOnChange() {
    this.ResetPage();
  }

  ClientListOnChange() {
    this.DisableSearch = false;
    if (this.ClientId == 0) {
      this.DisableSearch = true;
    }
    else {
      this.ResetPage();
    }
  }

  ResetPage() {
    this.ShowAging = false;
    this.ShowMain = false;
    this.ShowInventories = false;
    this.SelectedAging = null;
    this.SelectedStatus = '';
  }

  GetAging(s) {
    this.service.GetAging(this.ClientId, this.Action, this.ConvertDateFormat(this.FromDate), this.ConvertDateFormat(this.ToDate), s.Status_Name).subscribe(
      res => {
        this.SelectedStatus = s.Status_Name;
        this.StatusCount = s.Status_Count;
        this.AgingData = res.json().Data;
        this.ShowAging = true;
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    )
  }

  GetInventories(a) {
    if (a.Ageing_Bucket_Count != "0") {
      this.service.GetInventories(this.ClientId, this.Action, this.ConvertDateFormat(this.FromDate), this.ConvertDateFormat(this.ToDate), this.SelectedStatus, a.Ageing_Bucket_Name).subscribe(
        res => {
          this.SelectedAging = a;
          this.PopupHeader = this.SelectedStatus + ' (' + this.SelectedAging.Ageing_Bucket_Name + ')';
          this.StatusCount = this.SelectedAging.Ageing_Bucket_Count;
          this.Inventories = res.json().Data;
          this.ToggleAssistanceModal(false);
        },
        err => {
          this.ResponseHelper.GetFaliureResponse(err);
        }
      )
    }
  }

  ToggleAssistanceModal(event) {
    if (event == true) {
      this.ShowInventories = false;
      this.Search();
    }
    else {
      this.ShowInventories = !this.ShowInventories;
    }

  }

  BlockInput(event) {
    if (event.key == 'Backspace') {
      return true;
    }
    else {
      return false;
    }
  }

  Search() {
    this.ShowAging = false;
    this.SelectedAging = null;
    this.DisableSearch = true;
    this.SelectedStatus = '';
    this.service.GetSummaryAndStatus(this.ClientId, this.ConvertDateFormat(this.FromDate), this.ConvertDateFormat(this.ToDate), this.Action)
      .pipe(finalize(() => {
        this.DisableSearch = false;
      })).subscribe(
        res => {
          this.Statuses = res.json().Data.Status_Info;
          this.Summary = res.json().Data.Summary_Info;
          this.ShowMain = true;
        },
        err => {
          this.ShowMain = false;
          this.ResponseHelper.GetFaliureResponse(err);
        }
      )
  }

  ConvertDateFormat(date) {
    if (date) {
      return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
    }
    return "NA";
  }

}
