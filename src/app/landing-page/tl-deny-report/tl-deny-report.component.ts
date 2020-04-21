import { Component, OnInit } from '@angular/core';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { Token } from 'src/app/manager/token';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DenyService } from 'src/app/service/deny.service'
import * as moment from 'moment';
import { ExcelService } from 'src/app/service/client-configuration/excel.service';
import {dropDownFields} from 'src/app/manager/dropdown-feilds';



@Component({
  selector: 'app-tl-deny-report',
  templateUrl: './tl-deny-report.component.html',
  styleUrls: ['./tl-deny-report.component.css'],
  providers: [ExcelService,dropDownFields]
})
export class TlDenyReportComponent implements OnInit {
  Title = "Deny Report";
  Client_Id;
  ClientList: any[] = [];
  ClientId;
  singleclient;
  ResponseHelper: ResponseHelper;
  submit: FormGroup;
  DisableSearch = true;
  validated: boolean = false;
  invalidDate;
  showMain: boolean = false;

  rowData: any[] = [];
  showMsg = false
  headers: any[] = [];

  rowSelection = "single"
  FromDate=moment(new Date).subtract(1,'d').format('YYYY-MM-DDT00:00:00');
  MinDate=moment(new Date).subtract(1,'month').format('YYYY-MM-DDT00:00:00');;
  maxDate=moment(new Date).format('YYYY-MM-DDT00:00:00')
  ToDate = moment(new Date).format('YYYY-MM-DDT00:00:00');
  // Client_Id
  constructor(private selectedField:dropDownFields,private excelService: ExcelService, private service: DenyService, public fb: FormBuilder, private router: Router, private notification: NotificationService) {
    this.ResponseHelper = new ResponseHelper(this.notification);
  }


  ngOnInit() {

    let token = new Token(this.router);
    var userdata = token.GetUserData();
    this.ClientList = this.selectedField.setSelected(userdata.Clients)
    if(this.ClientList[0].selected==true){
      this.ClientId = this.ClientList[0].Client_Id
      this.singleclient = true
      this.DisableSearch = false
    } else {
      this.DisableSearch = true
    }
    this.submit = this.fb.group({
      "Client_Id": [this.ClientId],
      "from_date": [, Validators.required],
      "to_date": [, Validators.required]
    })
  }

  BlockInput(event) {
    if (event.key == 'Backspace' || event.key == 'Tab') {
      return true;
    }
    else {
      return false;
    }

  }
  selectedValue(data) {

    if (data.length == 1 && data.length) {
      data[0].selected = true;
      this.ClientId = data[0].Client_Id
      this.singleclient = true
      this.DisableSearch = false
    } else {
      this.DisableSearch = true
    }

  }
  ClientListOnChange(e) {
    this.DisableSearch = false
    this.ClientId = e.target.value

  }
  search() {
    
    this.validated = true;
    this.invalidDate = moment(this.submit.value.from_date) > moment(this.submit.value.to_date)
    var data = { "ClientId": this.ClientId, "from_date": moment(this.submit.value.from_date).format('YYYY-MM-DDT00:00:00'), "to_date": moment(this.submit.value.to_date).format('YYYY-MM-DDT00:00:00') }
    if (this.submit.valid && !this.invalidDate) {
      this.DisableSearch = true;
      this.DisableSearch = false;
      this.service.getReport(data).subscribe(res => {
        this.headers = []
        this.rowData = []
        this.ResponseHelper.GetSuccessResponse(res)
        var aa = res.json().Data;
        if (res.json().Data[0]) {
          this.showMsg = false
          aa.forEach(e => {
            var obj = e.reduce(function (total, current) {
              total[current.Header_Name] = current.Field_Value;
              return total;
            }, {});
            this.rowData.push(obj);
          });

          this.headers = []
          res.json().Data[0].forEach(i => {
            if (i.Header_Name == 'Id' || i.Header_Name == 'Inventory_Id') {

              this.headers.push({ headerName: i.Header_Name, field: i.Header_Name, hide: true, rowGroupIndex: null })

            }
            else {
              this.headers.push({ headerName: i.Header_Name, field: i.Header_Name })
            }
          })
          this.showMain = true
        } else {
          this.showMsg = true;
          this.showMain = false
        }


      }, err => {
        this.showMain = false;
        this.DisableSearch = false
        this.ResponseHelper.GetFaliureResponse(err)
      })
    }

  }


  export() {
    this.excelService.exportAsExcelFile(this.rowData, 'Deny_Report')

  }

}
