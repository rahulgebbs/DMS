import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { InsuranceService } from 'src/app/service/client-configuration/insurance.service';
import { Token } from '../../../manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import { ExcelService } from 'src/app/service/client-configuration/excel.service';
import { Router } from "@angular/router";
import { ResponseHelper } from 'src/app/manager/response.helper';
import { insuranceInfo } from './insurance-modal/insurance-modal.component'

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css'],
  providers: [ExcelService]
})
export class InsuranceComponent implements OnInit {
  validFile: boolean = false
  token: Token;
  fileupload
  userData;
  insuranceData;
  fileName;
  validated: boolean = false;
  base64textString: String = "";
  rowData;
  rowSelection = 'single'
  gridApi;
  files
  DisplayModal = false;
  ResponseHelper: ResponseHelper;
  gridColumnApi;
  Filename = "No File Chosen"
  showPopup: boolean = false;
  clientInsuranceData
  selectedClientRow: insuranceInfo = new insuranceInfo;
  selectedClientRowId;
  editinfo: boolean = true;
  onAdd: boolean = false;
  onEdit: boolean = false;
  uploadBtnDisable: boolean = true;
  disableDownloadTemplate: boolean = false;
  exportToBtnDisable: boolean = false;
  displaypopup: boolean = false;
  actionType;


  @Input() ClientData;
  @Output() next_page = new EventEmitter<any>();
  columnDefs = [
    { field: "Id", hide: true, rowGroupIndex: null },
    { headerName: 'Client  ID', field: 'Client_Id', hide: true, rowGroupIndex: null },
    { headerName: 'Global ID', field: 'Global_Insurance_Id', hide: true, rowGroupIndex: null },
    { headerName: 'Practice Name', field: 'Practice_Name' },
    { headerName: 'Payer Name', field: 'Payer_Name' },
    { headerName: "Global Insurance Added", field: "Global_Insurance_Added" },
    { headerName: 'Timely Filing Limits in Days', field: 'Timely_Filing_Limits_in_Days' },
    { headerName: 'Contact Number', field: 'Contact_Number' },
    { headerName: 'WebSite', field: 'Website' },
    { headerName: 'Start Time', field: 'Start_Time' },
    { headerName: "Claim Mailing Address", field: "Claim_Mailing_Address" },
    { headerName: "Appeal Mailing Address", field: "Appeal_Mailing_Address" },
    { headerName: 'End Time', field: 'End_Time' },
    { headerName: 'Appeal Filing Limit In Days', field: 'Appeal_Filing_Limit_In_Days' },
    { headerName: 'Financial', field: 'Financial_Class' },
    { headerName: "Appeal Mailing Address 1", field: "Appeal_Mailing_Address1" },
    { headerName: "Appeal Mailing Address 2", field: "Appeal_Mailing_Address2" },
    { headerName: "Appeal Mailing City", field: "Appeal_Mailing_City" },
    { headerName: "Appeal Mailing State", field: "Appeal_Mailing_State" },
    { headerName: "Appeal Mailing Zipcode", field: "Appeal_Mailing_Zipcode" },
    { headerName: "Claim Mailing Address 1", field: "Claim_Mailing_Address1" },
    { headerName: "Claim Mailing Address 2", field: "Claim_Mailing_Address2" },
    { headerName: "Claim Mailing City", field: "Claim_Mailing_City" },
    { headerName: "Claim Mailing State", field: "Claim_Mailing_State" },
    { headerName: "Claim Mailing Zipcode", field: "Claim_Mailing_Zipcode" },
    { headerName: "Fax No", field: "Fax_No" },
    { headerName: "Insurance Name Gebbs", field: "Insurance_Name_Gebbs" },
    { headerName: "Appeal Mailing FaxNo", field: "Appeal_Mailing_FaxNo" },
    { headerName: "Claim Mailing FaxNo", field: "Claim_Mailing_FaxNo" },
    { headerName: "Appeal Mailing ContactNo", field: "Appeal_Mailing_ContactNo" },
    { headerName: "Claim Mailing ContactNo", field: "Claim_Mailing_ContactNo" },
    { headerName: "Insurance Name For Appeal", field: "Insurance_Name_for_Appeal" },
    { headerName: "Insurance Name For Mail", field: "Insurance_Name_for_Mail" },
    { headerName: "Insurance Code", field: "Insurance_Code" },
    { headerName: "Insurance State", field: "Insurance_State" },
    { headerName: "Is IVR", field: "Is_IVR", cellRenderer: this.ValCheck },
    { headerName: "Is Voice", field: "Is_Voice", cellRenderer: this.ValCheck },
    { headerName: "Email Id", field: "Email_Id" },
    { headerName: "CSR Fax", field: "CSR_Fax" },
    { headerName: "Attention To", field: "Attention_To" },
    { headerName: "Setting Template", cellRenderer: this.MyCustomCellRendererClass },
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
  checkExport(val) {
    if (val) {
      val = 'Yes'
    } else {
      val = 'No'
    }
    return val;
  }

  MyCustomCellRendererClass() {
    let val = 'Setting Template';
    var eDiv = document.createElement('div');
    eDiv.innerHTML = '<button class="btn label grey label-info square-btn cursor w-auto mt-1" data-action-type="Setting_Template">' + val + '</button>';
    let eButton = eDiv.querySelectorAll('.btn')[0];
    // eButton.addEventListener('click', () => {
    //   
    //   this.DisplayModal = false;
    // });
    return eDiv;
  }


  onCellClicked(data) {
    this.actionType = data.event.target.getAttribute("data-action-type")

    if (data.colDef.headerName == "Setting Template" && this.actionType == "Setting_Template") {

      this.displaypopup = true;


    }
  }

  TogglePopup(event) {
    this.displaypopup = false;
  }





  handleFileSelect(evt) {
    if (evt.target.files && evt.target.files.length > 0) {
      this.files = evt.target.files;
      var file = this.files[0];
      this.Filename = file.name

      if (this.files && file) {

        this.validated = false
        var reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
        this.uploadBtnDisable = false
      }
      else {


        this.validated = true

      }
    } else {
      this.Filename = 'No File Chosen'
    }
  }


  _handleReaderLoaded(readerEvt) {

    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onRowClicked(e) {
    ;
    this.onEdit = true;
    this.selectedClientRowId = e.data.Id;
    if (this.actionType != "Setting_Template") {

      this.getSelectedClient();

    }
  }

  getSelectedClient() {
    ;
    this.services.getClientInsuranceInfo(this.ClientData.Id, this.selectedClientRowId).subscribe(
      res => {
        this.selectedClientRow = res.json().Data;
        this.DisplayModal = true;
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }

  ToggleModal(event) {
    this.DisplayModal = false;
    this.onAdd = false;
    this.onEdit = false;
  }


  onAddClicked() {
    this.onAdd = true;
    this.DisplayModal = true;
  }

  constructor(private router: Router, private services: InsuranceService, private excelService: ExcelService, private notificationservice: NotificationService) {
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();
    this.ResponseHelper = new ResponseHelper(this.notificationservice);

  }
  exportAsXLSX(): void {

    this.exportToBtnDisable = true;
    var exportData = [];

    this.rowData.forEach((el) => {
      var obj = new Object()
      // obj['Client ID'] = el.Client_Id;
      // obj['Global ID'] = el.Global_Insurance_Id;
      obj['Practice Name'] = el.Practice_Name;
      obj['Payer Name'] = el.Payer_Name;
      obj['Global Insurance Added'] = el.Global_Insurance_Added;
      obj['Timely Filing Limits in Days'] = el.Timely_Filing_Limits_in_Days;
      obj['Contact Number'] = el.Contact_Number;
      obj['Website'] = el.Website;
      obj['Start Time'] = el.Start_Time;
      obj['Claim Mailing Address'] = el.Claim_Mailing_Address;
      obj['Appeal Mailing Address'] = el.Appeal_Mailing_Address;
      //
      obj['End Time'] = el.End_Time;
      obj['Appeal Filing Limit In Days'] = el.Appeal_Filing_Limit_In_Days;
      obj['Financial Class'] = el.Financial_Class;
      obj['Appeal Mailing Address 1'] = el.Appeal_Mailing_Address1;
      obj['Appeal Mailing Address 2'] = el.Appeal_Mailing_Address2;
      obj['Appeal Mailing City'] = el.Appeal_Mailing_City;
      obj['Appeal Mailing State'] = el.Appeal_Mailing_State;
      obj['Appeal Mailing Zipcode'] = el.Appeal_Mailing_Zipcode;
      obj['Claim Mailing Address 1'] = el.Claim_Mailing_Address1;
      obj['Claim Mailing Address 2'] = el.Claim_Mailing_Address2;
      obj['Claim Mailing City'] = el.Claim_Mailing_City;
      obj['Claim Mailing State'] = el.Claim_Mailing_State;
      //
      obj['Claim Mailing Zipcode'] = el.Claim_Mailing_Zipcode;
      obj['Fax No'] = el.Fax_No;
      obj['Insurance Name Gebbs'] = el.Insurance_Name_Gebbs;
      obj['Appeal Mailing FaxNo'] = el.Appeal_Mailing_FaxNo;
      obj['Claim Mailing FaxNo'] = el.Claim_Mailing_FaxNo;
      obj['Appeal Mailing ContactNo'] = el.Appeal_Mailing_ContactNo;
      obj['Claim Mailing ContactNo'] = el.Claim_Mailing_ContactNo;
      obj['Insurance Name for Appeal'] = el.Insurance_Name_for_Appeal;
      obj['Insurance Name for Mail'] = el.Insurance_Name_for_Mail;
      obj['Insurance Code'] = el.Insurance_Code;
      obj['Insurance State'] = el.Insurance_State;
      obj['Is IVR'] = this.checkExport(el.Is_IVR);
      //
      obj['Is Voice'] = this.checkExport(el.Is_Voice);
      obj['Email Id'] = el.Email_Id;
      obj['CSR Fax'] = el.CSR_Fax;
      obj['Attention To '] = el.Attention_To;


      exportData.push(obj);
    })
    this.excelService.exportAsExcelFile(exportData, 'Client-Insurance-Export');
    this.exportToBtnDisable = false
  }
  ngOnInit() {
    if (this.ClientData.Is_Insurance_Uploaded) {
      this.getInsuranceDetail();
    } else {
      this.rowData = [];
    }
  }


  downloadFile() {
    this.disableDownloadTemplate = true
    this.services.downloadTemplate()
      .subscribe(res => {
        var url = window.URL.createObjectURL(res.data);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = res.filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        this.disableDownloadTemplate = false
      }, error => {
        this.ResponseHelper.GetFaliureResponse(error);
        this.disableDownloadTemplate = false
      }, () => {
      });

  }


  getInsuranceDetail() {
    if (this.ClientData) {
      this.insuranceData = this.ClientData
      this.services.getInsuranceData(this.ClientData.Id).subscribe(data => {

        let res = data.json()
        this.rowData = res.Data
        this.insuranceData = res.Data
      }, err => {
        this.rowData = [];
        this.ResponseHelper.GetFaliureResponse(err);

      })
    }
  }




  uploadClientInsuranceData() {
    this.validated = true
    if (this.Filename == 'No File Chosen') {
      this.validFile = false
    } else {
      this.validFile = true
    }
    this.fileupload = { File: this.base64textString, File_Name: this.Filename, Client_Id: this.ClientData.Id }
    if (this.validFile) {
      this.services.uploadClientInsuranceData(this.fileupload).subscribe(data => {
        this.uploadBtnDisable = true
        this.ResponseHelper.GetSuccessResponse(data);
        this.validated = false
        this.base64textString = null
        this.Filename = "No File Chosen"
        this.ClientData.Is_Insurance_Uploaded = true;
        // this.getInsuranceDetail()
      },
        err => {
          this.ResponseHelper.GetFaliureResponse(err);
        })

    }

  }

  navigate() {
    this.next_page.emit('insurance')
  }

}
