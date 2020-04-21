import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/service/notification.service';
import { Token } from 'src/app/manager/token';
import { Router } from '@angular/router';
import { ExcelService } from 'src/app/service/client-configuration/excel.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { ClientDashboardReportService } from 'src/app/service/client-dashboard-report.service';
import * as moment from 'moment'
@Component({
  selector: 'app-client-dashboard-report',
  templateUrl: './client-dashboard-report.component.html',
  styleUrls: ['./client-dashboard-report.component.css'],
  providers: [ExcelService]
})
export class ClientDashboardReportComponent implements OnInit {
  Title = "Client Dashboard Report";
  RowSelection = "single";
  UserId;
  GridApi;
  GridColumnApi;
  ColumnDefs = []
  RowData = [];
  Role;
  userdata
  ClientID;
  // FromDate: Date;
  // ToDate: Date;
  ResponseHelper: ResponseHelper;
  allFields
  // MinDate: Date;
  showpopup: boolean = false
  count = [];
  FromDate=moment(new Date).subtract(1,'d').format('YYYY-MM-DDT00:00:00');
  MinDate=moment(new Date).subtract(1,'month').format('YYYY-MM-DDT00:00:00');;
  maxDate=moment(new Date).format('YYYY-MM-DDT00:00:00')
  ToDate = moment(new Date).format('YYYY-MM-DDT00:00:00');

  disableExport: boolean = false
  constructor(private router: Router, private excelService: ExcelService, private notificationservice: NotificationService, private client_dashboard: ClientDashboardReportService) {
    var token = new Token(this.router);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.ResponseHelper = new ResponseHelper(this.notificationservice);

    this.ColumnDefs = [
      { field: "Id", hide: true, rowGroupIndex: null },
      { field: "Client_Id", hide: true, rowGroupIndex: null },
      {
        headerName: "Date", field: "Date", width: 200, cellRenderer: this.datecheck,
      },
      { headerName: "Total Touched", field: "Total_Touched", width: 250, cellRenderer: this.Align },
      { headerName: "Closed", field: "Client_Close", width: 250 , cellRenderer: this.ActionCellRendererClass, cellStyle: { cursor: 'pointer' }},
      {
        headerName: "Send To Gebbs", field: "Send_To_Gebbs", width: 250, cellRenderer: this.ActionCellRendererClass, cellStyle: { cursor: 'pointer' }
      },
      { headerName: "Kept On Hold", field: "Client_Hold", width: 250 , cellRenderer: this.ActionCellRendererClass, cellStyle: { cursor: 'pointer' }},
      { headerName: "Send To Internal Team", field: "Client_Internal_Team", width: 250 , cellRenderer: this.ActionCellRendererClass, cellStyle: { cursor: 'pointer' }}
    ];
  }

  ngOnInit() {
    var token = new Token(this.router);
    this.userdata = token.GetUserData();
    this.ClientID = this.userdata.Clients[0].Client_Id
    this.UserId = this.userdata.UserId;
  }

  datecheck(params) {
    let val
    val = moment(params.value).format('MM/DD/YYYY');
    return val
  }

  Align(params){
    let val
    let eDiv = document.createElement('div');
    // if (!params.value) {
    val = params.value
    eDiv.innerHTML = '<u style="margin-left:40px;">' + val + '</u>';
    // } 
    return eDiv;
  }

  OnGridReady(event) {
    this.GridApi = event.api;
    this.GridColumnApi = event.columnApi;
    setTimeout(function () {
      event.api.resetRowHeights();
    }, 500);
  }

  ActionCellRendererClass(params) {
    let val
    let eDiv = document.createElement('div');
    // if (!params.value) {
    val = params.value
    eDiv.innerHTML = '<u data-action-type="getcount" style="margin-left:40px;">' + val + '</u>';
    // } 
    return eDiv;
  }

  onColumnResized(event) {
    if (event.finished) {
      this.GridApi.resetRowHeights();
    }
  }

  BlockInput(e) {
    if (e.key == 'Backspace' || e.key == 'Tab') {
      return true;
    }
    else {
      return false;
    }
  }
  onChange(e) {

    if (this.FromDate == undefined && this.ToDate == undefined) {
      this.disableExport = true
    }
    else {
      this.disableExport = false
    }
  }

  getClientDashboardReport() {

    if (this.FromDate == undefined || this.ToDate == undefined) {
      this.disableExport = true
    } else {
      this.disableExport = false
      this.client_dashboard.getAllFields(this.ClientID, this.ConvertDateFormat(this.FromDate), this.ConvertDateFormat(this.ToDate)).subscribe(data => {
        this.allFields = data.json().Data
        this.RowData = this.allFields
        this.ResponseHelper.GetSuccessResponse(data);
      }, err => {

        this.ResponseHelper.GetFaliureResponse(err);
      })
    }
  }

  AutoSizeGrid(event) {
    event.columnApi.autoSizeColumns();
  }

  export(): void {

    if (this.FromDate == undefined || this.ToDate == undefined) {
      this.disableExport = true
    } else {
      this.disableExport = false
      this.client_dashboard.getExcel(this.ClientID, this.ConvertDateFormat(this.FromDate), this.ConvertDateFormat(this.ToDate)).subscribe(data => {
        var Excel = data.json().Data
        this.excelService.exportAsExcelFile(Excel, 'Client-Dashboard-Report');

      }, err => {
        this.ResponseHelper.GetFaliureResponse(err);
      })
    }
  }
//'To Gebbs','Hold','Close','To Internal
  onCellClicked(event) {
    
    let actionType = event.event.target.getAttribute("data-action-type")
    if (actionType == "getcount") {
      
    if(event.colDef.field== 'Client_Internal_Team'){
      var x='To Internal'
    }else if(event.colDef.field== 'Client_Close'){
      var x='Close'
    }
    else if(event.colDef.field== 'Send_To_Gebbs'){
      var x='To Gebbs'

    }else if(event.colDef.field== 'Client_Hold'){
      var x='Hold'
    }
    this.client_dashboard.getCount(this.ClientID, event.data.Date,x).subscribe(data => {
      
      this.count = data.json().Data
      
      this.ResponseHelper.GetSuccessResponse(data);
      this.showpopup = true
    }, err => {
      
      
      this.count = [];
      this.ResponseHelper.GetFaliureResponse(err);
    })
  }
  }
  toggleModal() {
    this.showpopup = false
  }

  ConvertDateFormat(date) {
    if (date) {
      return moment(date).format('MM/DD/YYYY')
    }
    return "NA";
  }
}
