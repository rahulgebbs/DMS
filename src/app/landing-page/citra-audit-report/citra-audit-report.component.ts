import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { Token } from 'src/app/manager/token';
import { SimpleReportService } from 'src/app/service/simple-report.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { dropDownFields } from 'src/app/manager/dropdown-feilds';
import { ExcelService } from 'src/app/service/client-configuration/excel.service';
import { CitraAuditReportService } from 'src/app/service/citra-audit-report.service';

@Component({
  selector: 'app-citra-audit-report',
  templateUrl: './citra-audit-report.component.html',
  styleUrls: ['./citra-audit-report.component.css'],
  providers: [dropDownFields, ExcelService]
})
export class CitraAuditReportComponent implements OnInit {
  validationError: boolean = false
  Title = "Citra Audit Report";
  ShowModal = false;
  ClientId: number = 0;
  UserId: number;
  SelectedEmployees = [];
  EmployeeString = "";
  DisableEmployeeSelect = true;
  ClientList: any[] = [];
  ResponseHelper: ResponseHelper;
  Employees = [];
  DisplayError = false;
  MinDate1: Date = new Date('01/01/1990');
  MinDate2: Date = new Date('01/01/1990');
  maxDate1: Date;
  FromDate: Date = new Date();
  ToDate: Date = new Date();
  Role;
  CitraAuditForm: FormGroup;
  token: Token
  only_worked: boolean = false
  isChecked
  fromtime
  disablesubmit: boolean = true;
  singleclient: boolean = false
  DonwloadConfig: boolean = false;


  constructor(private excel: ExcelService, private selectField: dropDownFields, private router: Router, private notification: NotificationService, private simpleservice: SimpleReportService, private citraauditreport: CitraAuditReportService, private fb: FormBuilder) {
    this.ResponseHelper = new ResponseHelper(this.notification);
    this.maxDate1 = new Date(moment(new Date).format('YYYY-MM-DDT23:59'))
  }

  ngOnInit() {
    let token = new Token(this.router);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.Role = userdata.Role;
    this.ClientList = this.selectField.setSelected(userdata.Clients);
    if (this.ClientList[0].selected == true) {
      this.disablesubmit = false

      this.ClientId = this.ClientList[0].Client_Id
      this.singleclient = true;
      // this.ShowDownloadButton(this.ClientId);
    }
    this.selectedValue(this.ClientList)

    this.SetDateByRole();
    this.CreateForm();
  }

  selectedValue(data) {

    if (data.length == 1 && data.length) {

      this.DisableEmployeeSelect = false;
      this.disablesubmit = false
      data[0].selected = true;
      this.ClientId = data[0].Client_Id
      this.singleclient = true;
      this.GetAllEmployees();
    } else {

    }

  }

  CreateForm() {
    if (!this.singleclient) {
      this.CitraAuditForm = this.fb.group({

        'Client_Id': ['', Validators.required],
        'Employee_Ids': ['', Validators.required],
        'From_Date': [this.FromDate],
        'To_Date': [this.ToDate, Validators.required],
        'From_Time': ['', Validators.required],
        'To_Time': ['', Validators.required],
        'Is_Only_Worked': [false, Validators.required],

      }
        // {
        //  validator: Validators.compose([customValidation.CompareTime])
        // }
      )
    } else {
      this.CitraAuditForm = this.fb.group({
        'Client_Id': [this.ClientId, Validators.required],
        'Employee_Ids': ['', Validators.required],
        'From_Date': [this.FromDate],
        'To_Date': [this.ToDate, Validators.required],
        'From_Time': ['', Validators.required],
        'To_Time': ['', Validators.required],
        'Is_Only_Worked': [false, Validators.required],

      }
      )
    }
  }

  SetDateByRole() {
    this.FromDate.setDate(this.FromDate.getDate() - 1);
    this.ToDate.setDate(this.ToDate.getDate());
    if (this.Role == "Supervisor") {
      this.MinDate1 = new Date();
      this.MinDate2 = new Date()
      this.MinDate1.setMonth(this.MinDate1.getMonth() - 4);
      this.MinDate2.setMonth(this.MinDate1.getMonth());
      this.MinDate2.setDate(this.MinDate1.getDate() + 1);
      this.MinDate2.setFullYear(this.MinDate1.getFullYear())
    }
  }

  OpenModal() {
    this.ShowModal = true;
  }

  CloseModal() {
    this.ShowModal = false;
    this.Employees.forEach(e => {
      if (e.Is_Selected && !e.Is_Old) {
        e.Is_Selected = false;
      }
      if (!e.Is_Selected && e.Is_Old) {
        e.Is_Selected = true;
      }
    })
  }

  resetForm() {
    this.CitraAuditForm.reset({
      ClientId: this.ClientList[0].Client_Id,
      Employee_Ids: '',
      From_Date: this.FromDate,
      To_Date: this.ToDate,
      From_Time: '',
      To_Time: '',
      Is_Only_Worked: false
    })
    this.ClientId
  }

  GetAllEmployees() {
    this.citraauditreport.GetAllSupervisors(this.ClientId).subscribe(
      res => {
        this.Employees = res.json().Data;
        this.Employees.forEach(e => {
          e.Is_Selected = false;

        })
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err)
      }
    )
  }

  OnFromDateChange(event) {
    this.getFromTime()
    // console.log(event)
    if (event.value > this.ToDate) {
      let todate = new Date(event.value);
      todate.setDate(todate.getDate() + 1)
      let date = new Date(event.value);
      this.CitraAuditForm.patchValue({ 'To_Date': todate, 'From_Date': date })
    } else {
      let date = new Date(event.value);
      let todate = new Date()
      this.CitraAuditForm.patchValue({ 'To_Date': todate, 'From_Date': date })
    }
  }

  OnToDateChange(event) {
    this.getFromTime()
    // console.log(event)
    if (event.value < this.FromDate) {
      let date = new Date(event.value)
      date.setDate(date.getDate() - 1);
      let todate = new Date(event.value);
      // this.MisForm.patchValue({ 'To_Date': todate })
      this.CitraAuditForm.patchValue({ 'To_Date': todate })
    }
  }


  ClientListOnChange(event) {

    this.disablesubmit = false
    this.EmployeeString = "";
    this.SelectedEmployees = [];
    this.Employees.forEach(e => {
      e.Is_Selected = false;
      e.Is_Old = false;
    })
    this.CitraAuditForm.patchValue({ 'Employee_Ids': '' });
    if (!event.target.value || event.target.value == "0") {
      this.DisableEmployeeSelect = true;
    }
    else {
      this.ClientId = event.target.value;
      this.DisableEmployeeSelect = false;
      this.GetAllEmployees()
      // this.ShowDownloadButton(this.ClientId);
    }
  }

  // ShowDownloadButton(ClientId) {
  //   this.citraauditreport.ReportDownloadConfig(ClientId).subscribe(
  //     res => {
  //       //var abc =res.json().Data;
  //       this.DonwloadConfig = res.json().Data.Is_Simple_Report_Download;
  //       console.log(res.json().Data.Is_Simple_Report_Download);
  //     },
  //     err => {
  //       this.ResponseHelper.GetFaliureResponse(err);
  //     })
  // }


  // GetSimpleReportData() {
  //   if (this.CitraAuditForm.valid) {
  //     this.DisplayError = false;
  //     this.CitraAuditForm.value.From_Date = moment(this.CitraAuditForm.value.From_Date).format('YYYY-MM-DD')
  //     this.CitraAuditForm.value.To_Date = moment(this.CitraAuditForm.value.To_Date).format('YYYY-MM-DD')
  //     // console.log(this.SimpleForm.value);

  //     this.citraauditreport.GetReportDownload(this.CitraAuditForm.value).pipe(finalize(() => {
  //       this.EmployeeString = "";
  //       this.CreateForm();
  //       //this.resetForm();
  //     })).subscribe(
  //       res => {
  //         this.disablesubmit = true
  //         this.excel.downloadExcel(res)
  //         this.ResponseHelper.GetSuccessResponse(res);
          
  //       },
  //       err => {
  //         console.log('error');
  //         this.ResponseHelper.GetFaliureResponse(err);
  //       }
  //     )
  //   }
  //   else {
  //     this.DisplayError = true;
  //   }
  // }

  SetSelectedEmp(event) {
    this.CitraAuditForm.patchValue({ 'Employee_Ids': '' })
    this.EmployeeString = "";
    this.SelectedEmployees = event;
    this.ShowModal = false;
    this.SelectedEmployees.forEach(e => {
      let name = e.Employee_Code + " " + e.Full_Name;
      this.EmployeeString += name;
      this.EmployeeString += (", ");

    })
    this.EmployeeString = this.EmployeeString.substring(0, this.EmployeeString.length - 2);
    let selectedId = [];
    this.SelectedEmployees.forEach(e => {
      selectedId.push(e.Id)
    });
    this.CitraAuditForm.patchValue({ 'Employee_Ids': selectedId })
  }

  ExportToExcel() {
    if (this.CitraAuditForm.value.From_Time == "" && this.CitraAuditForm.value.Employee_Ids != "") {
      this.CitraAuditForm.patchValue({ 'From_Time': "0:00" })
      this.CitraAuditForm.patchValue({ 'To_Time': "0:00" })
      this.exportFunction()
      this.Employees.forEach(e => {
        e.Is_Selected = false;
      })
    } 
    else {
      this.exportFunction()
    }
  }

  exportFunction() {

    if (this.CitraAuditForm.valid) {
      this.DisplayError = false;
      this.CitraAuditForm.value.From_Date = moment(this.CitraAuditForm.value.From_Date).format('YYYY-MM-DD')
      this.CitraAuditForm.value.To_Date = moment(this.CitraAuditForm.value.To_Date).format('YYYY-MM-DD')

      this.citraauditreport.GetReportDownload(this.CitraAuditForm.value).pipe(finalize(() => {
        this.EmployeeString = "";
        this.CreateForm();
        //this.resetForm();
      })).subscribe(
        res => {
          this.disablesubmit = true
          this.excel.downloadExcel(res)
          this.resetForm()
          this.ResponseHelper.GetSuccessResponse(res);
        },
        err => {
          this.ResponseHelper.GetFaliureResponse(err);
        }
      )
    }
    else {
      this.DisplayError = true;
    }
  }

  getFromTime() {

    let startDate = moment(this.CitraAuditForm.value.From_Date).format('YYYY-MM-DD');
    let endDate = moment(this.CitraAuditForm.value.To_Date).format('YYYY-MM-DD');
    let startTime = startDate + " " + this.CitraAuditForm.value.From_Time;
    let endTime = endDate + " " + this.CitraAuditForm.value.To_Time
    startTime = moment(startTime).format('YYYY-MM-DDTHH:mm');
    endTime = moment(endTime).format('YYYY-MM-DDTHH:mm');
    if (startTime < endTime) {
      this.validationError = false
    } else {
      this.validationError = true
    }
  }

  function(event) {
    if (event.target.checked) {
      this.only_worked = true
    } else {
      this.only_worked = false

    }
  }

  BlockInput(event) {
    if (event.key == 'Backspace' || event.key == 'Tab') {
      return true;
    }
    else {
      return false;
    }

  }

}
