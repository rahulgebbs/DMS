import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common-service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { Token } from 'src/app/manager/token';
import { finalize } from 'rxjs/operators';
import { ClientInstructionService } from 'src/app/service/client-instruction.service';
import * as moment from 'moment';
import { ExcelService } from 'src/app/service/client-configuration/excel.service';


@Component({
  selector: 'app-client-instruction-report',
  templateUrl: './client-instruction-report.component.html',
  styleUrls: ['./client-instruction-report.component.css'],
  providers: [ExcelService]
})
export class ClientInstructionReportComponent implements OnInit {
  Title = "Client Instruction Report";
  RowSelection = "single";
  ResponseHelper: ResponseHelper;
  UserId;
  GridApi;
  GridColumnApi;
  showCount: boolean = true
  showGebbsAction: boolean = true
  readCountData = [];
  canEdit: boolean = true;
  ColumnDefs = []
  RowData = [];
  Role;
  userdata
  ClientID;
  selectedRecord: boolean = false;
  constructor(private router: Router, private excelService: ExcelService, private notificationservice: NotificationService, private commonservice: CommonService, private instructionservice: ClientInstructionService) {
    var token = new Token(this.router);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.Role = userdata.Role;
    switch (this.Role) {
      case "Client Supervisor":
        this.showGebbsAction = false
        break;
      case "Supervisor":
        this.showCount = false;
        break;
    }

    this.ColumnDefs = [
      { field: "Id", hide: true, rowGroupIndex: null },
      { field: "Client_Id", hide: true, rowGroupIndex: null },
      {
        headerName: "Payer Name", field: "Payer_Name", width: 250, cellClass: "cell-wrap-text",
        autoHeight: true
        , cellStyle: { 'white-space': 'normal' }
      },
      { headerName: "Practice Name", field: "Practice_Name", width: 250 },
      { headerName: "Provider Name", field: "Provider_Name", width: 250 },
      {
        headerName: "Instructions", field: "Instructions", width: 250, cellClass: "cell-wrap-text",
        autoHeight: true, cellStyle: { 'white-space': 'normal' }
      },
      { headerName: "Created / Modified Date", field: 'Updated_Date', cellRenderer: this.datecheck },
      { headerName: "Status", field: "Type" },
      { headerName: "Count", field: "Read_By_Agent_Count", width: 170, cellRenderer: this.ActionCellRendererClass, cellStyle: { cursor: 'pointer' }, hide: this.showCount },
      { headerName: "GeBBS Action", field: "Read_By", hide: this.showGebbsAction, cellRenderer: this.Action, },
    ];
  }
  datecheck(params) {

    let val
    val = moment(params.value).format('MM/DD/YYYY');
    return val
  }
  ngOnInit() {

    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    var token = new Token(this.router);
    this.userdata = token.GetUserData();
    this.ClientID = this.userdata.Clients[0].Client_Id
    this.UserId = this.userdata.UserId;
    this.GetClientInstructions()

  }

  OnGridReady(event) {
    //event.api.sizeColumnsToFit()
    //event.api.sizeColumnsToFit() 
    this.GridApi = event.api;
    this.GridColumnApi = event.columnApi;
    setTimeout(function () {
      event.api.resetRowHeights();
    }, 500);
  }

  onColumnResized(event) {
    if (event.finished) {
      this.GridApi.resetRowHeights();
    }
  }


  AutoSizeGrid(event) {
    event.columnApi.autoSizeColumns();
  }





  GetClientInstructions() {

    this.instructionservice.GetClientInstructions(this.ClientID).pipe(finalize(() => {
    })).subscribe(
      res => {

        this.RowData = res.json().Data
      },
      err => {

        this.RowData = [];
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }

  export(): void {
    var report = [];
    this.RowData.forEach((el) => {
      var obj = new Object()
      obj['Payer Name'] = el.Payer_Name;
      obj['Practice Name'] = el.Practice_Name;
      obj['Provider Name'] = el.Provider_Name;
      obj['Instructions'] = el.Instructions;
      obj['PayCreated / Modified Date_Name'] = moment(el.Updated_Date).format("MM/DD/YYYY");
      obj['Status'] = el.Type;
      obj['GeBBS Action'] = this.reportAction(el.Read_By);
      report.push(obj);
    })
    this.excelService.exportAsExcelFile(report, 'Client-Instruction-Report');
  }

  ActionCellRendererClass(params) {
    let val
    let eDiv = document.createElement('div');
    val = params.value
    eDiv.innerHTML = '<u>' + val + '</u>';
    return eDiv;
  }

  Action(params) {
    let val
    if (params.value == 0) {
      val = "No Action Taken"
    } else if (params.value == 1) {
      val = "Reviewed_Accepted"
    }
    return val;
  }

  reportAction(val) {
    if (val == 0) {
      val = "No Action Taken"
    } else if (val == 1) {
      val = "Reviewed_Accepted"
    }
    return val;
  }

}

