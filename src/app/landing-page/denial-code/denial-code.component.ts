import { Component, OnInit ,Input} from '@angular/core';
import { CommonService } from 'src/app/service/common-service';
import { Token } from 'src/app/manager/token';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { DenialCodeService } from './../../service/denial-code.service';
import { DenialCodeInfo } from './../denial-code/denial-code-modal/denial-code-modal.component';
import { dropDownFields } from "src/app/manager/dropdown-feilds";
import { ExcelService } from 'src/app/service/client-configuration/excel.service';


@Component({
  selector: 'app-denial-code',
  templateUrl: './denial-code.component.html',
  styleUrls: ['./denial-code.component.css'],
  providers: [dropDownFields]
})
export class DenialCodeComponent implements OnInit {
  Title = "Denial Code Master";
  ResponseHelper: ResponseHelper;
  ClientId = 0;
  ClientList: any[] = [];
  UserId: number;
  selecterror: boolean = false;
  searchBtnDisable: boolean = true;
  gridApi;
  gridColumnApi;
  rowData: any = [];
  RowSelection = "single";
  SelectedDenialCodeId: number;
  SelectedDenialCode: DenialCodeInfo = new DenialCodeInfo;;
  SelectedClientId: number;
  DisplayModal: boolean = false;
  onAdd: boolean = false;
  onEdit: boolean = false;
  clients;
  validated: boolean = false;
  File;
  Filename = 'No File Chosen';
  FileBase64;
  fileSelected: boolean = true;
  uploadBtnDisable: boolean = true;
  downloadTemplateDisable: boolean = false;
  exportBtnDisable: boolean = false;

  columnDefs = [

    { headerName: "Denial Code", field: "Denial_Code" },
    { headerName: "Denial Discription", field: "Denial_Description" },
    { headerName: "AM Comments", field: "AM_Comments" },
    { field: "Denial_Code_Id", hide: true, rowGroupIndex: null },
    { field: "Client_Id", hide: true, rowGroupIndex: null }
  ]



  constructor(private selectedFields: dropDownFields, private denialcodeservice: DenialCodeService, private commonservice: CommonService, private router: Router, private notificationservice: NotificationService,private excelService: ExcelService) {

    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }

  ngOnInit() {
    var token = new Token(this.router);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.ClientList = this.selectedFields.setSelected(userdata.Clients)
    if (this.ClientList[0].selected) {
      this.ClientId = this.ClientList[0].Client_Id
      this.GetDenialCodeList('')
    }
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }


  onAddClicked() {
    this.onAdd = true;
    this.DisplayModal = true;
  }

  OnRowClicked(event) {
    this.onEdit = true;
    this.SelectedDenialCodeId = event.data.Denial_Code_Id;
    this.SelectedClientId = event.data.Client_Id,
      this.GetSelectedDenialCode();
  }

  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  ToggleModal(event) {
    this.DisplayModal = false;
    this.onAdd = false;
    this.onEdit = false;
  }


  GetSelectedDenialCode() {
    this.denialcodeservice.GetSelectedDenialCode(this.SelectedClientId, this.SelectedDenialCodeId).subscribe(
      res => {
        this.SelectedDenialCode = res.json().Data;
        this.DisplayModal = true
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );

  }

  GetDenialCodeList(data: string) {

    if (data == 'Search') {
      if (this.ClientId == undefined || this.ClientId == 0) {
        this.selecterror = true;
      }
      else {
        this.searchBtnDisable = true
        this.selecterror = false;
      }
    }

    if (this.ClientId) {
      this.denialcodeservice.GetAllDenialCode(this.ClientId).subscribe(data => {
        this.searchBtnDisable = false
        let res = data.json()
        this.rowData = res.Data
      }, err => {
        this.searchBtnDisable = false
        this.rowData = [];
        this.ResponseHelper.GetFaliureResponse(err)
      });
    }
  }



  ClientOnChange(event) {
    this.ClientId = event.target.value;
    if (!event.target.value || event.target.value == "") {
      this.selecterror = true;
    }
    else {
      this.searchBtnDisable = false
      this.selecterror = false;
      this.ClientId = event.target.value;
    }
  }


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
      this.Filename='No File Chosen'
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
    let dataobj = { File: this.FileBase64, File_Name: this.Filename ,Client_Id: this.ClientId };
    
    if (this.fileSelected) {
      this.denialcodeservice.uploadDenialCode(dataobj).subscribe(res => {
        this.validated = false
        this.fileSelected = false
        this.Filename = "No File Chosen"
        this.ResponseHelper.GetSuccessResponse(res)
        //this.ClientData.Is_SAAG_Uploaded = true;
      },
        err => {

          this.ResponseHelper.GetFaliureResponse(err)
        }
        
      );
      this.GetDenialCodeList('')
    }
  }



  downloadTemplate() {
    this.downloadTemplateDisable = true
    this.denialcodeservice.downloadTemplate().subscribe(res => {
      this.downloadTemplateDisable = false
      this.excelService.downloadExcel(res)
    }, err => {
      this.downloadTemplateDisable = false
      this.ResponseHelper.GetFaliureResponse(err)
    })
  }
 

  exportToExcel() {
    this.exportBtnDisable = true
    var exportData = [];
    this.rowData.forEach((el) => {
      var obj = new Object()
      obj['Denial Code'] = el.Denial_Code;
      obj['Denial Description'] = el.Denial_Description;
      obj['AM Comments'] = el.AM_Comments;
      exportData.push(obj);
      console.log(obj);
    })
    this.excelService.exportAsExcelFile(exportData, 'Denial-Code-Export');
    this.exportBtnDisable = false
  }
}
