import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/service/notification.service';
import { Token } from 'src/app/manager/token';
import { Router } from '@angular/router';
import { ExcelService } from 'src/app/service/client-configuration/excel.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { AgeingDashboardReportService } from 'src/app/service/ageing-dashboard-report.service';
import * as moment from 'moment';
import { dropDownFields } from 'src/app/manager/dropdown-feilds';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-ageing-dashboard-report',
  templateUrl: './ageing-dashboard-report.component.html',
  styleUrls: ['./ageing-dashboard-report.component.css'],
  providers: [ExcelService, dropDownFields]
})
export class AgeingDashboardReportComponent implements OnInit {
  Title = "Ageing Dashboard Report";
  RowSelection = "single";
  UserId;
  GridApi;
  GridColumnApi;
  ColumnDefs = []
  RowData = [];
  Role;
  userdata
  ClientID;
  ResponseHelper: ResponseHelper;
  ClientId;
  ClientList
  AgeingData;
  submit
  disableExport: boolean = false
  clienterror: boolean = false;
  FromDate = moment(new Date).subtract(1, 'd').format('YYYY-MM-DDT00:00:00');
  MinDate = moment(new Date).subtract(1, 'month').format('YYYY-MM-DDT00:00:00');;
  maxDate = moment(new Date).format('YYYY-MM-DDT00:00:00')
  ToDate = moment(new Date).format('YYYY-MM-DDT00:00:00');
  constructor(public fb: FormBuilder, private router: Router, private selectedField: dropDownFields, private excelService: ExcelService, private notificationservice: NotificationService, private ageing: AgeingDashboardReportService) {
    var token = new Token(this.router);
    this.submit = this.fb.group({
      "Client_Id": [this.ClientId],

    })
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.ResponseHelper = new ResponseHelper(this.notificationservice);

    this.ColumnDefs = [

      {
        headerName: "Account Number", field: "Account_Number", width: 200
      },
      { headerName: "Date Of Service", field: "Date_Of_Service", cellRenderer: this.formatDate, width: 200, },
      { headerName: "Action Date", field: "Action_Date", cellRenderer: this.formatDate2, width: 200 },
      {
        headerName: "Action", field: "Action", width: 200,
      },
      { headerName: "Role", field: "Role", width: 200 },
      { headerName: "Ageing", field: "Ageing", width: 200 },
      {
        headerName: "Over all Ageing", field: "Over_all_Ageing", width: 200,
      },
      { headerName: "TAT", field: "TAT", width: 200 },
      { headerName: "Overall TAT", field: "Overall_TAT", width: 200 }
    ];
  }
  formatDate(params) {
   
    let val = params.value.replace(' | ','T');
    let val2 = moment(val ,"DD MMM YYYYTHH:mm:ss").format('MM/DD/YYYY');
    return val2
  }

  formatDate2(params) {
   
    let val = params.value.replace(' | ','T');
    let val2 = moment(val ,"DD MMM YYYYTHH:mm:ss").format('MM/DD/YYYY | HH:mm:ss');
    return val2
  }

  dateform(val){
    
    val = val.replace(' | ','T');
    let val2 = moment(val ,"DD MMM YYYYTHH:mm:ss").format('MM/DD/YYYY');
    return val2
  }

  dateform2(val){
    
    val = val.replace(' | ','T');
    let val2 = moment(val ,"DD MMM YYYYTHH:mm:ss").format('MM/DD/YYYY | HH:mm:ss');
    return val2
  }
  ngOnInit() {

    var token = new Token(this.router);
    this.userdata = token.GetUserData();
    this.ClientList = this.selectedField.setSelected(this.userdata.Clients)
    if (this.ClientList[0].selected) {
      this.ClientId = this.ClientList[0].Client_Id
    }
    this.UserId = this.userdata.UserId;
  }

  OnGridReady(event) {

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

  onClientChange(e) {
    this.clienterror = false
  }
  onChange(e) {

    if (this.FromDate == undefined && this.ToDate == undefined) {
      this.disableExport = true
    } else {
      this.disableExport = false
    }
  }

  Search() {
    if (this.ClientId == undefined || this.ClientId == '0') {
      this.clienterror = true
    } else {
      this.clienterror = false
      if (this.FromDate == undefined || this.ToDate == undefined) {
        this.disableExport = true
      } else {

        this.disableExport = false
        this.ageing.getAllFields(this.ClientId, this.ConvertDateFormat(this.FromDate), this.ConvertDateFormat(this.ToDate)).subscribe(data => {
          
          this.AgeingData = data.json().Data
          this.RowData = this.AgeingData
          this.ResponseHelper.GetSuccessResponse(data);

        }, err => {
          this.ResponseHelper.GetFaliureResponse(err);
        })
      }
    }
  }

  export(): void {
    
    if (this.ClientId == undefined || this.ClientId == '0') {
      this.clienterror = true
    } else {
      this.clienterror = false
      if (this.FromDate == undefined || this.ToDate == undefined) {
        this.disableExport = true
      } else {

        
    var exportData = [];

    this.RowData.forEach((el) => {
      var obj = new Object()
      obj['Account Number'] = el.Account_Number;
      obj['Date Of Service']=this.dateform(el.Date_Of_Service);
      obj['Action Date']=this.dateform2(el.Action_Date);
      obj['Action']=el.Action;
      obj['Role']=el.Role;
      obj['Ageing']=el.Ageing;
      obj['Over all Ageing']=el.Over_all_Ageing;
      obj['TAT']=el.TAT;
      obj['Overall TAT']=el.Overall_TAT;
      exportData.push(obj);  
    })
        this.excelService.exportAsExcelFile(exportData, 'Ageing-Dashboard-Report');
      }
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

  AutoSizeGrid(event) {
    event.columnApi.autoSizeColumns();
  }

  ConvertDateFormat(date) {
    if (date) {
      return moment(date).format('MM/DD/YYYY')

    }
    return "NA";
  }
}
