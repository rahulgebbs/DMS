import { Component, OnInit } from '@angular/core';
import { UnworkedAccountsReportService } from 'src/app/service/unworked-accounts-report.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { Token } from 'src/app/manager/token';
import { Router } from '@angular/router';
import { dropDownFields } from 'src/app/manager/dropdown-feilds';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { ExcelService } from 'src/app/service/client-configuration/excel.service';

@Component({
  selector: 'app-unworked-accounts-report',
  templateUrl: './unworked-accounts-report.component.html',
  styleUrls: ['./unworked-accounts-report.component.css'],
  providers: [dropDownFields]
})
export class UnworkedAccountsReportComponent implements OnInit {
  disablesubmit:boolean=true;
  Title = "Unworked Accounts Report";
  ShowModal = false;
  DisplayError = false;
  EmployeeString="";
  SelectedEmployees=[];
  Employees=[];
  UnworkedForm:FormGroup;
  DisableEmployeeSelect=true;
  ClientId:number=0;
  ResponseHelper: ResponseHelper;
  DonwloadConfig:boolean=false;
  UserId: number;
  Role;
  ClientList:any[]=[];
  singleclient: boolean = false;


  constructor(private excelService:ExcelService, private unworkedAccountService:UnworkedAccountsReportService,private notification: NotificationService,private router: Router,private selectField: dropDownFields,private fb: FormBuilder) { 
    this.ResponseHelper = new ResponseHelper(this.notification);
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
    }
    this.selectedValue(this.ClientList)

    //this.SetDateByRole();
    this.CreateForm();
  }

  ClientListOnChange(event) {

    this.disablesubmit = false
    this.EmployeeString = "";
    this.SelectedEmployees = [];
    this.Employees.forEach(e => {
      e.Is_Selected = false;
      e.Is_Old = false;
    })
    this.UnworkedForm.patchValue({ 'Employee_Ids': '' });
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


//all methods
GetAllEmployees() {
  this.unworkedAccountService.GetAllEmployees(this.ClientId).subscribe(
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

// ShowDownloadButton(ClientId)
// {
// this.unworkedAccountService.ReportDownloadConfig(ClientId).subscribe(
// res =>{
// //var abc =res.json().Data;
// this.DonwloadConfig=res.json().Data.Is_Simple_Report_Download; 
// console.log(res.json().Data.Is_Simple_Report_Download); 
// },
// err=>{
// this.ResponseHelper.GetFaliureResponse(err);
// } )
// }

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
    this.UnworkedForm = this.fb.group({

      'Client_Id': ['', Validators.required],
      'Employee_Ids': ['', Validators.required]   
    }     
    )
  } else {
    this.UnworkedForm = this.fb.group({
      'Client_Id': [this.ClientId, Validators.required],
      'Employee_Ids': ['', Validators.required]   
    }     
    )
  }
}

resetForm() {


  this.UnworkedForm.reset({

    ClientId: this.ClientList[0].Client_Id,
    Employee_Ids: '',
  
  })
  this.ClientId
}
// SetSelectedEmp(event) {
//   this.UnworkedForm.patchValue({ 'Employee_Ids': '' })
//   this.EmployeeString = "";
//   this.SelectedEmployees = event;
//   this.ShowModal = false;
//   this.SelectedEmployees.forEach(e => {
//     let name = e.Employee_Code + " " + e.Full_Name;
//     this.EmployeeString += name;
//     this.EmployeeString += (", ");

//   })
// }
SetSelectedEmp(event) {
  this.UnworkedForm.patchValue({ 'Employee_Ids': '' })
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
    selectedId.push(e.Employee_Code)
  });
  this.UnworkedForm.patchValue({ 'Employee_Ids': selectedId })
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

ExportToExcel() { 

    if (this.UnworkedForm.value.Employee_Ids != "") {
      this.exportFunction()
      this.Employees.forEach(e => {
        e.Is_Selected = false;

      })
    } else {
      this.exportFunction()
    }

}


exportFunction() {
  if (this.UnworkedForm.valid) {
    this.DisplayError = false;   
    // console.log(this.SimpleForm.value);

    this.unworkedAccountService.GetReport(this.UnworkedForm.value).pipe(finalize(() => {
      this.EmployeeString = "";
      this.CreateForm();
      //this.resetForm();
    })).subscribe(
      res => {
        this.excelService.downloadExcel(res)
        this.ResponseHelper.GetSuccessResponse(res);
        this.disablesubmit = true
        // this.ResponseHelper.GetSuccessResponse(res);
        // this.disablesubmit = true
      },
      err => {
       // this.ResponseHelper.GetFaliureResponse(err);
       console.log('error');
       this.ResponseHelper.GetFaliureResponse(err);
      }
    )
  }
  else {
    this.DisplayError = true;
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
