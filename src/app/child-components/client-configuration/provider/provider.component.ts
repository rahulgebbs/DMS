import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProviderService } from '../../../service/client-configuration/provider.service'
import { Token } from '../../../manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { ExcelService } from 'src/app/service/client-configuration/excel.service';
import * as moment from 'moment'

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css'],
  providers: [ExcelService]
})
export class ProviderComponent implements OnInit {
  @Input() ClientData;
  @Output() next_page = new EventEmitter<any>();

  addProvider: FormGroup;
  token: Token;
  File;
  validFile: boolean = false
  Filename = 'No File Chosen';;
  FileBase64;
  validated: boolean = false;
  ResponseHelper;
  saveAs: any;
  fileSelected: boolean = true;
  userData;
  uploadBtnDisable: boolean = true;
  downloadTemplateDisable: boolean = false;
  exportDisable: boolean = false;
  showPopup: boolean = false;
  SelectedProvider: any;
  editProvider;
  showEditPopup: boolean = false;
  actionType: string;



  columnDefs = [
    { headerName: 'ID', field: 'Id', hide: "false" },
    { headerName: 'Practice Code', field: 'Practice_Code' },
    {
      headerName: 'Practice Name', field: 'Practice_Name',
    },
    {
      headerName: 'Provider Code', field: 'Provider_Code',
    },
    {
      headerName: 'Provider Last Name', field: 'Provider_Legal_LastName',
    },
    {
      headerName: 'Provider First Name', field: 'Provider_Legal_FirstName',
    },
    {
      headerName: 'Provider Type', field: 'Provider_Type',
    },
    {
      headerName: 'Provider Group Name', field: 'Provider_Group_Name',
    },
    {
      headerName: 'Tax Id', field: 'TAX_ID',
    },
    //
    { headerName: 'Individual NPI', field: 'Individual_NPI' },
    { headerName: 'Group NPI', field: 'Group_NPI' },
    { headerName: 'Medicare PTAN', field: 'Medicare_PTAN' },
    { headerName: 'MID TID TPG', field: 'MID_TID_TPG' },
    { headerName: 'Physical AddressLine1', field: 'Physical_AddressLine1' },
    { headerName: 'Physical AddressLine2', field: 'Physical_AddressLine2' },
    { headerName: 'Physical City', field: 'Physical_City' },
    { headerName: 'Physical State', field: 'Physical_State' },
    //
    { headerName: 'Physical Zip', field: 'Physical_Zip' },
    { headerName: 'Physical Phone', field: 'Physical_Phone' },
    { headerName: 'Physical Fax No', field: 'Physical_Fax_No' },
    { headerName: 'PayToAdd AddressLine1', field: 'PayToAdd_AddressLine1' },
    { headerName: 'PayToAdd AddressLine2', field: 'PayToAdd_AddressLine2' },
    { headerName: 'PayToAdd City', field: 'PayToAdd_City' },
    { headerName: 'PayToAdd State', field: 'PayToAdd_State' },
    { headerName: 'PayToAdd Zip', field: 'PayToAdd_Zip' },
    //
    { headerName: 'PayToAdd Phone', field: 'PayToAdd_Phone' },
    { headerName: 'PayToAdd Fax', field: 'PayToAdd_Fax' },
    { headerName: 'IsEnrolled For EDI', field: 'IsEnrolled_For_EDI', cellRenderer: this.ValCheck },
    { headerName: 'Enrollment Date', field: 'Enrollment_Date', cellRenderer: this.datecheck },
    //
    { headerName: 'Line Of Business', field: 'Line_of_Business' },
    { headerName: 'Vendor Name', field: 'Vendor_Name' },
    { headerName: 'Enrollment Helpdesk Email', field: 'Enrollment_Helpdesk_Email' },
    { headerName: 'Enrollment Helpdesk PH No', field: 'Enrollment_Helpdesk_PH_No' },
    { headerName: 'Contact Person Name', field: 'Contact_Person_Name' },
    { headerName: 'Contact Person Address', field: 'Contact_Person_Address' },
    { headerName: 'Contact Person CallBackNo', field: 'Contact_Person_CallBack_No' },
    { headerName: 'Provider Signature', field: 'Provider_Signature', cellRenderer: this.MyCustomCellRendererClass },
    { headerName: 'Provider Signature Uploaded', field: 'Is_Signature_Uploaded', cellRenderer: this.ValCheck }

  ]

  ValCheck(params) {

    let val
    if (params.value) {
      val = 'Yes'
    } else {
      val = 'No'
    }
    return val;
  }

  datecheck(params) {
    if (!params.value) {

    } else {
      let val
      val = moment(params.value).format('MM/DD/YYYY');
      return val
    }

  }


  datechecker(val) {
    if (!val) {

    } else {
      val = moment(val).format('MM/DD/YYYY');
      return val
    }
  }

  rowData;
  rowSelection = "single";
  gridApi;
  gridColumnApi;

  MyCustomCellRendererClass() {
    let val = 'Upload Provider Signature';
    var eDiv = document.createElement('div');
    eDiv.innerHTML = '<button class="btn label grey label-info square-btn cursor w-auto mt-1" data-action-type="upload">' + val + '</button>';

    return eDiv;
  }

  onCellClicked(data) {

    this.actionType = data.event.target.getAttribute("data-action-type")
    if (data.colDef.headerName == "Provider Signature" && this.actionType == "upload") {
      this.showPopup = true;
    }
  }

  onRowClicked(event) {
    // this.SelectedProvider = event.data.Id;
    //remove this after api 
    // this.service.getProvider(event.data.Id).subscribe(res => {
    //   this.editProvider = res.json().Data;
    // }, err => {
    //   this.ResponseHelper.GetFaliureResponse(err)
    // })
    this.editProvider = event.data

    if (this.actionType != "upload") {

      this.getProviderdata()

    }
  }

  getProviderdata() {
    this.service.getProviders(this.editProvider.Client_Id, this.editProvider.Id).subscribe(data => {

      this.SelectedProvider = data.json().Data;
      this.SelectedProvider.Enrollment_Date = this.FormatDateMethod(this.SelectedProvider.Enrollment_Date);


      this.showEditPopup = true;

    })
  }

  FormatDateMethod(inputdate) {
    if (inputdate) {
      var date = new Date(inputdate);
      return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    }
    return null;

  }

  closeEdit(e) {
    this.showEditPopup = false

  }
  // constructor(private router :Router,public fb: FormBuilder, private service: ProviderService) {


  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  constructor(private excelService: ExcelService, private router: Router, public fb: FormBuilder, private service: ProviderService, private notificationService: NotificationService) {
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();
    this.addProvider = this.fb.group({
      "file_upload_field": [""]
    })

  }

  ngOnInit() {
    if (this.ClientData.Is_Provider_Uploaded) {
      this.getProviderMaster();
    } else {
      this.rowData = [];
    }
    this.ResponseHelper = new ResponseHelper(this.notificationService);
  }
  submitFrom() {
    this.next_page.emit('provider');
  }

  getProviderMaster() {

    if (this.ClientData) {
      this.service.getProviderList(this.userData.TokenValue, this.ClientData.Id).subscribe(data => {

        let res = data.json();

        this.rowData = res.Data
      }, err => {
        this.rowData = []
        this.ResponseHelper.GetFaliureResponse(err)

      })
    }
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.columnApi.autoSizeColumns();
  }
  exporttoExcel() {
    this.exportDisable = true


    var exportData = [];

    this.rowData.forEach((el) => {
      var obj = new Object()
      obj['Practice Code'] = el.Practice_Code;
      obj['Practice Name'] = el.Practice_Name;
      obj['Provider Code'] = el.Provider_Code;
      obj['Provider Last Name'] = el.Provider_Legal_LastName;
      obj['Provider First Name'] = el.Provider_Legal_FirstName;
      obj['Provider Type'] = el.Provider_Type;
      obj['Provider Group Name'] = el.Provider_Group_Name;
      obj['Tax Id'] = el.TAX_ID;
      obj['Individual NPI'] = el.Individual_NPI;
      obj['Group NPI'] = el.Group_NPI;
      obj['Medicare PTAN'] = el.Medicare_PTAN;
      obj['MID TID TPG'] = el.MID_TID_TPG;
      obj['Physical AddressLine1'] = el.Physical_AddressLine1;
      obj['Physical AddressLine2'] = el.Physical_AddressLine2;
      obj['Physical City'] = el.Physical_City;
      obj['Physical State'] = el.Physical_State;
      //
      obj['Physical Zip'] = el.Physical_Zip;
      obj['Physical Phone'] = el.Physical_Phone;
      obj['Physical Fax No'] = el.Physical_Fax_No;
      obj['PayToAdd AddressLine1'] = el.PayToAdd_AddressLine1;
      obj['PayToAdd AddressLine2'] = el.PayToAdd_AddressLine2;
      obj['PayToAdd City'] = el.PayToAdd_City;
      obj['PayToAdd State'] = el.PayToAdd_State;
      obj['PayToAdd Zip'] = el.PayToAdd_Zip;
      //
      obj['PayToAdd Phone'] = el.PayToAdd_Phone;
      obj['PayToAdd Fax'] = el.PayToAdd_Fax;
      obj['IsEnrolled For EDI'] = el.IsEnrolled_For_EDI;
      obj['Enrollment Date'] = this.datechecker(el.Enrollment_Date);
      //
      obj['Line Of Business'] = el.Line_of_Business;
      obj['Vendor Name'] = el.Vendor_Name;
      obj['Enrollment Helpdesk Email'] = el.Enrollment_Helpdesk_Email;
      obj['Enrollment Helpdesk PH No'] = el.Enrollment_Helpdesk_PH_No;
      obj['Contact Person Name'] = el.Contact_Person_Name;
      obj['Contact Person Address'] = el.Contact_Person_Address;
      obj['Contact Person CallBackNo'] = el.Contact_Person_CallBack_No;
      obj['Provider Signature Uploaded'] = el.Is_Signature_Uploaded;
      exportData.push(obj);
    })
    this.excelService.exportAsExcelFile(exportData, 'ProviderMaster-Export');
    // this.excelService.exportAsExcelFile(this.rowData, 'ProviderMaster-Export');
    this.exportDisable = false
  }

  changeListener(event): void {
    if (event.target.files && event.target.files.length > 0) {
      this.validated = false;
      this.File = event.target.files[0];
      this.Filename = this.File.name;
      this.fileSelected = true
      // this.DisableUpload = false;
      this.ConvertToBase64()
    }
    else {
      this.validated = true
      this.Filename = "No File Chosen"
      this.File = null;
      this.FileBase64 = null;

    }
  }


  ConvertToBase64() {
    let reader = new FileReader();
    reader.readAsDataURL(this.File);
    reader.onload = () => {
      this.FileBase64 = reader.result.toString().split(',')[1];
    }
    this.uploadBtnDisable = false
  }

  uploadFile() {


    if (this.Filename != 'No File Chosen') {
      this.fileSelected = true
    } else {
      this.fileSelected = false
    }
    let dataobj = { File: this.FileBase64, File_Name: this.Filename, Client_Id: this.ClientData.Id };

    if (this.FileBase64) {
      let dataobj = { File: this.FileBase64, File_Name: this.Filename, Client_Id: this.ClientData.Id };
      this.service.uploadMaster(this.userData.TokenValue, dataobj).subscribe(data => {
        // this.getProviderMaster();
        this.uploadBtnDisable = true
        this.validated = false

        this.Filename = 'No File Chosen';
        this.File = [];
        this.FileBase64 = null
        this.ClientData.Is_Provider_Uploaded = true
        this.ResponseHelper.GetSuccessResponse(data)
      },
        err => {
          this.ResponseHelper.GetFaliureResponse(err)
        }
      );
    }
  }

  downloadTemplate() {
    this.service.downloadTemplate(this.userData.TokenValue).subscribe(res => {
      this.downloadTemplateDisable = true
      this.excelService.downloadExcel(res)
      this.downloadTemplateDisable = false
    }, err => {
      this.downloadTemplateDisable = false
      this.ResponseHelper.GetFaliureResponse(err)
    })
  }

  nevigate() {
    this.next_page.emit('provider');
  }

  ToggleModal(event) {
    this.showPopup = false;
    this.getProviderMaster()
  }

}

