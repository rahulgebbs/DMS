import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserManagementService } from '../../service/user-management.service'
import { NotificationService } from 'src/app/service/notification.service';
import { customValidation } from '../../manager/customValidators';
import { Token } from '../../manager/token';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { editUserInfo } from 'src/app/manager/field.interface';
import { ExcelService } from 'src/app/service/client-configuration/excel.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  addUser: FormGroup;
  ResponseHelper;
  checkNumber: boolean = false;
  show: boolean = false
  title = 'User Management';
  paginationPageSize = 10;
  editUser: editUserInfo = new editUserInfo();
  validated: boolean = false;
  user_Type;
  role: any[] = [];
  client: any[] = [];
  finalClient: string[] = [];
  setClient: any;
  userData: any;
  Token: Token;
  canEditData: boolean = true;
  activeAccount: boolean = true;
  accountTerminated: boolean = false;
  accountLocked: boolean = false
  canClose: boolean = true;
  rowSelection = "single";
  gridApi;
  gridColumnApi;
  submitBtnDisable: boolean = false;
  editClient: boolean = true;
  File;
  Filename = 'No File Chosen';
  FileBase64;
  fileSelected: boolean = true;
  uploadBtnDisable: boolean = true;
  downloadTemplateDisable: boolean = false;
  exportBtnDisable: boolean = false;

  columnDefs = [
    { headerName: 'ID', field: 'Id', hide: "false" },
    { headerName: 'Employee Code', field: 'Employee_Code' },
    { headerName: 'User Name', field: 'Username' },
    { headerName: 'Full Name', field: 'Full_Name' },
    { headerName: 'Email Id', field: 'Email_Id' },
    { headerName: 'Process', field: 'CommaSeparatedClients' },
    { headerName: 'Role', field: 'Role' },
    { headerName: 'Activate', field: 'Is_Deactivated', cellRenderer: this.isAcitvate },
    { headerName: 'Locked', field: 'Is_Locked', cellRenderer: this.ValCheck },
    { headerName: 'Terminated', field: 'Is_Terminated', cellRenderer: this.ValCheck },
    { headerName: 'User Type', field: 'User_Type' },
    { headerName: 'Expertise_In_Call', field: 'Expertise_In_Call', cellRenderer: this.ValCheck },
    { headerName: 'Expertise_In_Website', field: 'Expertise_In_Website', cellRenderer: this.ValCheck },
    { headerName: 'Expertise_In_Email', field: 'Expertise_In_Email', cellRenderer: this.ValCheck },
    { headerName: 'Expertise_In_Fax', field: 'Expertise_In_Fax', cellRenderer: this.ValCheck },
    { headerName: 'URL', field: 'URL', cellRenderer: this.ValCheck },
  ];
  rowData;
  constructor(private router: Router, private service: UserManagementService,
    private notificationservice: NotificationService, public fb: FormBuilder, private excelService: ExcelService) {
    this.addUser = fb.group({
      'User_Type': ["", Validators.compose([Validators.required, Validators.maxLength(20)])],
      'Role': ["", Validators.compose([Validators.required, Validators.maxLength(20)])],
      'Employee_Code': ["", Validators.compose([Validators.required, Validators.max(99999999999999999999), Validators.pattern('^[0-9]+([0]{365})?$')])],
      //  Validators.compose([Validators.max(99999999999999999999)])],
      'Username': ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      'Email_Id': ["", Validators.compose([Validators.required, Validators.maxLength(50), Validators.email])],
      'Full_Name': ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      'Is_Deactivated': [""],
      'Is_Locked': [""],
      'Is_Terminated': [""],
      'Expertise_In_Website': [""],
      'Expertise_In_Fax': [""],
      'Expertise_In_Email': [""],
      'Expertise_In_Call': [""],
      'Comma_Separated_Clients': [""],
      'Id': [""],
      'Experties': [""],
      "URL": [""],
      "Updated_Date": [""],
      "vals": [""]
    },
      {
        validator: Validators.compose([customValidation.userMangementValidation])
      });
    this.Token = new Token(this.router);
    this.userData = this.Token.GetUserData();
    this.client = this.userData.Clients
    if (this.userData.Role == "Client Supervisor") {
      // this.client = this.userData.Clients
      this.client.forEach(item => {
        item.old = true;
        item.checked = true;
      })
      this.getFinalSelectedClient();
      this.addUser.patchValue({ "Comma_Separated_Clients": this.setClient })
      this.editClient = false
      this.getUserList();
      this.getUserType();
      // } else if (this.userData.Role == "Admin" || this.userData.Role == "Administrator") {
    } else if (this.userData.Role == "Admin") {
      // this.client = this.userData.Client
      this.getUserList();
      this.getUserType();
    } else {
      this.getUserList();
      this.getUserType();
      this.getClientList();
      this.selectedClient('');
    }

  }

  ngOnInit() {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }
  ValCheck(params) {
    let val
    if (params.value) {
      val = 'Yes'
    } else {
      val = 'No'
    }
    return val;
  }
  isAcitvate(params) {
    let val
    if (params.value) {
      val = 'No'
    } else {
      val = 'Yes'
    }
    return val;
  }
  getUserList() {
    this.service.getUserList(this.userData.TokenValue).subscribe((data) => {
      let response = data.json();
      if (response.Message[0].Type == "SUCCESS") {
        this.rowData = response.Data;
      } else {
        this.ResponseHelper.GetFaliureResponse(data)
      }
    }, err => {
      this.ResponseHelper.GetFaliureResponse(err)
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.columnApi.autoSizeColumns();
  }

  onCellClicked(e) {
    this.submitBtnDisable = false
    this.validated = false
    this.canClose = true;
    // this.finalClient=[]
    // this.setClient=[];
    this.addUser.value.Comma_Separated_Clients = []
    let userId = e.data.Id;
    this.addUser.patchValue({ 'Id': e.data.Id })
    this.service.getUser(this.userData.TokenValue, userId).subscribe((data) => {
      let response = data.json();
      if (response.Message[0].Type == "SUCCESS") {
        this.editUser = new editUserInfo()
        this.editUser = (response.Data);
        this.seletedUserType(this.editUser)
        this.getClientList()
        this.disableEmpCode(this.editUser)
        this.canEditData = customValidation.validRole(this.editUser, this.userData.Role);
        if (this.canEditData) {
          this.addUser.get('Role').enable();
        } else {
          this.addUser.get('Role').disable();
        }
      } else {
        this.ResponseHelper.GetFaliureResponse(data)
      }
    }, err => {
      this.ResponseHelper.GetFaliureResponse(err)
    });
  }

  submitFrom() {
    this.getFinalSelectedClient();
    this.validated = true;
    // this.addUser.value.Comma_Separated_Clients=[]
    // this.setClient=[]
    this.addUser.patchValue({ "Comma_Separated_Clients": this.setClient })
    this.patchValues()
    if (this.addUser.valid && this.validated && this.canEditData) {
      this.submitBtnDisable = true;
      if (this.addUser.value.Id) {
        this.service.updateUser(this.addUser.value, this.userData.TokenValue).subscribe((data) => {
          this.getUserList();
          this.getClientList()
          this.finalClient = []
          this.setClient = []
          this.ResponseHelper.GetSuccessResponse(data)
          this.clearForm();
          this.submitBtnDisable = false
        }, err => {
          this.submitBtnDisable = false
          this.ResponseHelper.GetFaliureResponse(err)
        });
      } else {
        this.service.saveUser(this.addUser.value, this.userData.TokenValue).subscribe((data) => {
          this.getUserList();
          this.getClientList()
          this.ResponseHelper.GetSuccessResponse(data)
          this.clearForm();
          this.submitBtnDisable = false

        }, err => {
          this.submitBtnDisable = false
          this.ResponseHelper.GetFaliureResponse(err)
        })
      }
    }
  }

  seletedUserRole(e) {

    if (e.target.value) {
      if (e.target.value.indexOf('Client') > -1) {
        this.addUser.value.Employee_Code = ""
        this.addUser.get('Employee_Code').disable();
        this.addUser.get('Employee_Code').clearValidators()
        this.addUser.get('Employee_Code').reset()
      } else {
        this.addUser.get('Employee_Code').enable()
      }
    } else if (e) {
      if (e.indexOf('Client') > -1) {
        this.addUser.value.Employee_Code = ""
        this.addUser.get('Employee_Code').disable();
        this.addUser.get('Employee_Code').clearValidators()
        this.addUser.get('Employee_Code').reset()

      } else {
        this.addUser.get('Employee_Code').enable()
      }
    }
    this.canEditData = customValidation.validRole(this.addUser.value, this.userData.Role);
  }

  seletedUserType(editUser) {

    if (editUser.target) {

      let Role = editUser.target.value
      this.disableEmpCode(Role)
      if (editUser.target.value.indexOf('Client') > -1) {
        this.role = []
        this.role.push(
          {
            "Id": "Client Supervisor",
            "Value": "Client Supervisor"
          },
          {
            "Id": "Client User",
            "Value": "Client User"
          }
        );
        this.addUser.value.Role = "Client Supervisor"
      } else if ((editUser.target.value).indexOf('GeBBS') > -1) {
        this.role = []
        this.role.push(
          {
            "Id": "Administrator",
            "Value": "Administrator"
          },
          {
            "Id": "Admin",
            "Value": "Admin"
          },
          {
            "Id": "Agent",
            "Value": "Agent"
          },
          {
            "Id": "Controller",
            "Value": "Controller"
          },
          {
            "Id": "Director",
            "Value": "Director"
          },
          {
            "Id": "Manager",
            "Value": "Manager"
          },
          {
            "Id": "Supervisor",
            "Value": "Supervisor"
          })

        this.addUser.value.Role = "Agent"
      } else if ((editUser.target.value).indexOf('Demo') > -1) {
        this.role = [];
        this.role.push(
          {
            "Id": "Administrator",
            "Value": "Administrator"
          },
          {
            "Id": "Admin",
            "Value": "Admin"
          },
          {
            "Id": "Agent",
            "Value": "Agent"
          },
          {
            "Id": "Client Supervisor",
            "Value": "Client Supervisor"
          },
          {
            "Id": "Client User",
            "Value": "Client User"
          },
          {
            "Id": "Controller",
            "Value": "Controller"
          },
          {
            "Id": "Director",
            "Value": "Director"
          },
          {
            "Id": "Manager",
            "Value": "Manager"
          },
          {
            "Id": "Supervisor",
            "Value": "Supervisor"
          })
        this.addUser.value.Role = "Agent"
      }

      // this.canEditData = customValidation.validRole(this.editUser, this.userData.Role);
    } else {
      if (editUser.User_Type.indexOf('Client') > -1) {
        this.role = []
        this.role.push({
          "Id": "Client Supervisor",
          "Value": "Client Supervisor"
        },
          {
            "Id": "Client User",
            "Value": "Client User"
          }
        );
        this.addUser.value.Role = "Client Supervisor"
      } else if ((editUser.User_Type).indexOf('GeBBS') > -1) {
        this.role = []
        this.role.push(
          {
            "Id": "Administrator",
            "Value": "Administrator"
          },
          {
            "Id": "Admin",
            "Value": "Admin"
          }, {
            "Id": "Agent",
            "Value": "Agent"
          },
          {
            "Id": "Controller",
            "Value": "Controller"
          },
          {
            "Id": "Director",
            "Value": "Director"
          },
          {
            "Id": "Manager",
            "Value": "Manager"
          },
          {
            "Id": "Supervisor",
            "Value": "Supervisor"
          })
        this.addUser.value.Role = "Agent";
      } else if ((editUser.User_Type).indexOf('Demo') > -1) {
        this.role = [];
        this.role.push(
          {
            "Id": "Administrator",
            "Value": "Administrator"
          },
          {
            "Id": "Admin",
            "Value": "Admin"
          }, {
            "Id": "Agent",
            "Value": "Agent"
          },
          {
            "Id": "Client Supervisor",
            "Value": "Client Supervisor"
          },
          {
            "Id": "Client User",
            "Value": "Client User"
          },
          {
            "Id": "Controller",
            "Value": "Controller"
          },
          {
            "Id": "Director",
            "Value": "Director"
          },
          {
            "Id": "Manager",
            "Value": "Manager"
          },
          {
            "Id": "Supervisor",
            "Value": "Supervisor"
          })
        this.addUser.value.Role = "Agent";
      }

      // 
    }


    if (editUser.Role) {
      this.addUser.value.Role = editUser.Role
    } else {

    }
    if (this.addUser.value.Role) {
      this.editUser.Role = this.addUser.value.Role
    }

    this.canEditData = customValidation.validRole(this.editUser, this.userData.Role);
    this.validated = false
  }

  getUserType() {
    this.service.getLookUp(this.userData.TokenValue).subscribe((data) => {

      let response = data.json();
      if (response.Message[0].Type == "SUCCESS") {
        this.user_Type = response.Data.User_Type;
        this.role = response.Data.Role;
      } else {
        this.ResponseHelper.GetFaliureResponse(data)
      }

    }, err => {
      this.ResponseHelper.GetFaliureResponse(err)
    })
  }

  getClientList() {
    this.client = this.userData.Clients;
    // if (this.editUser.Role == 'Admin' || this.editUser.Role == 'Administrator') {
    if (this.editUser.Role == 'Admin') {
      this.client.forEach(item => {
        item.old = true;
        item.checked = true;
        item.editClientBox = true
      })
    } else {
      this.client = []
      this.client = this.userData.Clients;
      // this.editUser.Clients=this.client
      this.client.forEach(item => {
        item.old = false;
        item.checked = false;
        item.editClientBox = false
      })
      this.selectedClient(this.editUser)
    }


  }

  clearForm() {
    this.finalClient = []
    this.setClient = []
    this.clearClient()
    this.validated = false;
    this.canEditData = true;
    this.addUser.get('Role').enable()
    this.addUser.reset();
  }

  changeCheckbox(i, e) {
    // if (this.editUser && (this.editUser.Role == "Admin" || this.editUser.Role == "Administrator")) {
    if (this.editUser && (this.editUser.Role == "Admin")) {
      e.preventDefault();
    } else {
      this.client[i].checked = !this.client[i].checked;
    }

  }

  selectedClient(user) {
    if (user && user.Clients) {
      for (let j = 0; j < user.Clients.length; j++) {
        for (let i = 0; i < this.client.length; i++) {
          if (user.Clients[j] == this.client[i].Client_Name) {
            this.client[i].checked = true;
            this.client[i].old = true
          }
        }
      }
    }
  }

  getFinalSelectedClient() {
    this.setClient = []
    this.finalClient = []
    for (let i = 0; i < this.client.length; i++) {
      if ((this.client[i].checked == true)) {
        this.finalClient.push(this.client[i].Client_Name);
        this.finalClient.toString();
        this.setClient = this.finalClient.toString();
        // this.canClose = customValidation.agentPopup(this.addUser.value.Role, this.setClient)
      } else {
        this.client[i].checked == false
        this.client[i].old = false
      }
    }

    if (this.setClient != []) {
      this.submitBtnDisable = false
    }
  }

  patchValues() {
    if (this.addUser.value.Role != 'Agent') {
      this.addUser.value.Expertise_In_Call = false
      this.addUser.value.Expertise_In_Website = false
      this.addUser.value.Expertise_In_Email = false
      this.addUser.value.Expertise_In_Fax = false
    }
    if (this.addUser.value.Is_Deactivated == null || this.addUser.value.Is_Deactivated == undefined) {
      this.addUser.value.Is_Deactivated = false
    }
    if (this.addUser.value.Is_Locked == null || this.addUser.value.Is_Locked == undefined) {
      this.addUser.value.Is_Locked = false
    }
    if (this.addUser.value.Is_Terminated == null || this.addUser.value.Is_Terminated == undefined) {
      this.addUser.value.Is_Terminated = false
    }
    if (this.addUser.value.User_Type == "Client") {
      this.addUser.value.URL = true;
      this.addUser.value.Employee_Code = ""
    } else {
      this.addUser.value.URL = false;
    }
    if ((this.addUser.value.Role == "Client User" || this.addUser.value.Role == "Client Supervisor") && this.addUser.value.Employee_Code == null) {
      this.addUser.value.Employee_Code = ""
    }
    if (this.addUser.value.Expertise_In_Call == null || this.addUser.value.Expertise_In_Call == undefined) {
      this.addUser.value.Expertise_In_Call = false
    }
    if (this.addUser.value.Expertise_In_Website == null || this.addUser.value.Expertise_In_Website == undefined) {
      this.addUser.value.Expertise_In_Website = false
    }
    if (this.addUser.value.Expertise_In_Email == null || this.addUser.value.Expertise_In_Email == undefined) {
      this.addUser.value.Expertise_In_Email = false
    }
    if (this.addUser.value.Expertise_In_Fax == null || this.addUser.value.Expertise_In_Fax == undefined) {
      this.addUser.value.Expertise_In_Fax = false
    }

  }

  clearClient() {
    this.canClose = true
    this.finalClient = []
    this.setClient = []
    for (let i = 0; i < this.client.length; i++) {
      this.client[i].checked = false;
      this.client[i].old = false;
    }

  }

  disableEmpCode(user) {
    if (user.Role) {
      if (user.Role.indexOf('Client') > -1) {
        this.addUser.value.Employee_Code = ""
        this.editUser.Role = ""
        this.addUser.get('Employee_Code').disable();
        this.addUser.get('Employee_Code').clearValidators()
        this.addUser.get('Employee_Code').reset()

      } else {
        this.addUser.get('Employee_Code').enable()
      }
    }
    else {
      if (user.indexOf('Client') > -1) {
        this.addUser.value.Employee_Code = ""

        this.addUser.get('Employee_Code').disable();
        this.addUser.get('Employee_Code').reset()
        this.addUser.get('Employee_Code').clearValidators()

      } else {
        this.addUser.get('Employee_Code').enable()
      }
    }

  }

  checkOk() {
    let dataobj = [];
    this.getFinalSelectedClient();
    this.canClose = customValidation.agentPopup(this.addUser.value.Role, this.setClient)
    if (this.canClose == false) {
      this.show = true




    } else {

      this.client.forEach(e => {
        if (e.checked) {
          e.old = true;
          dataobj.push(e);
        } else {
          e.old = false;
          e.checked = false
          e.new = false
          dataobj.push(e);
        }
      })
      this.toggelPopup();
    }
  }

  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  toggelPopup() {
    this.show = !this.show
    this.validated = false
  }
  closePopup() {

    this.validated = false;
    this.canClose = true;
    this.show = false;
    for (let i = 0; i < this.client.length; i++) {
      if ((this.client[i].checked || !this.client[i].checked) && this.client[i].old != true) {
        this.client[i].checked = false;
        this.client[i].old = false
      }
    }
  }
  checkIsNumber(name, val) {
    this.checkNumber = customValidation.numOnly(val)
    if (this.checkNumber) {
      this.addUser.get(name).setErrors({ 'invalid': true })
    } else {
      this.addUser.get(name).setErrors(null)
    }
  }

  // Upload functinality added on 30-07-2019 
  changeListener(event): void {
    if (event.target.files && event.target.files.length > 0) {
      this.validated = false
      this.File = event.target.files[0];
      this.Filename = this.File.name;
      this.fileSelected = true
      this.uploadBtnDisable = false
      this.ConvertToBase64()
    }
    else {
      this.Filename = 'No File Chosen'
      this.File = null;
      this.validated = true
      this.FileBase64 = null;
    }
  }

  ConvertToBase64() {
    let reader = new FileReader();
    reader.readAsDataURL(this.File);
    reader.onload = () => {
      this.FileBase64 = reader.result.toString().split(',')[1];
    }
  }


  FileUpload() {
    this.validated = true
    if (this.Filename != 'No File Chosen') {
      this.fileSelected = true
    } else {
      this.fileSelected = false
    }
    this.uploadBtnDisable = true
    let dataobj = { File: this.FileBase64, File_Name: this.Filename };

    if (this.fileSelected) {
      this.service.uploadUserData(dataobj).subscribe(res => {
        this.validated = false
        this.fileSelected = false
        this.Filename = "No File Chosen"
        this.ResponseHelper.GetSuccessResponse(res)
      },
        err => {

          this.ResponseHelper.GetFaliureResponse(err)
        }
      );
    }
  }



  downloadTemplate() {
    this.downloadTemplateDisable = true
    this.service.downloadTemplate().subscribe(res => {
      this.downloadTemplateDisable = false
      this.excelService.downloadExcel(res)
    }, err => {
      this.downloadTemplateDisable = false
      this.ResponseHelper.GetFaliureResponse(err)
    })
  }


  // exportToExcel() {
  //   this.exportBtnDisable = true
  //   var exportData = [];
  //   this.rowData.forEach((el) => {
  //     var obj = new Object()
  //     obj['Denial Code'] = el.Denial_Code;
  //     obj['Denial Description'] = el.Denial_Description;
  //     obj['AM Comments'] = el.AM_Comments;
  //     exportData.push(obj);
  //     console.log(obj);
  //   })
  //   this.excelService.exportAsExcelFile(exportData, 'User-Data-Export');
  //   this.exportBtnDisable = false
  // }
}
