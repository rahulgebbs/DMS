import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { UploadFileService } from 'src/app/service/upload-file.service';
import { Token } from 'src/app/manager/token';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
  title: string = "Referece Document Upload";
  Filename = "No File Chosen";
  Size;
  File;
  FileBase64;
  DisplayFileError = false;
  DisplaySizeError = false;
  ResponseHelper;
  UserId: number;
  ClientList: any[] = [];
  selecterror: boolean = false;
  ClientId: number;
  checkRecords: boolean = false;
  uploadBtnDisable: boolean = true;
  searchBtnDisable: boolean = true;
  token: Token;
  referencefiles = [];
  GridApi;
  GridColumnApi;
  ColumnDefs = []
  RowData = [];

  constructor(private service: UploadFileService, private router: Router, private notificationservice: NotificationService) { }

  ngOnInit() {

    this.ColumnDefs = [
      { headerName: "Uploaded Date & Time", field: "Uploaded_On" },
      { headerName: "Uploaded by", field: "Uploaded_By" },
      { headerName: "Client Name", field: "Client_Id" },
      { headerName: "Uploader Role", field: "Uploader_Role" },
      { headerName: "File Name", field: "File_Name" },
      { headerName: "Attachment", field: "File_Name" },
      { headerName: "Read", field: "Read_By_Agent_Count" }
    ]

    this.ResponseHelper = new ResponseHelper(this.notificationservice);

    let token = new Token(this.router)
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.ClientList = userdata.Clients;
    this.selectedValue(this.ClientList);
    this.GetSelectedReferenceFile();
  }

  selectedValue(data) {

    if (data.length == 1 && data.length) {
      data[0].selected = true;
      this.searchBtnDisable = false
      this.ClientId = data[0].Client_Id
      this.GetSelectedReferenceFile()
    } else {

    }

  }

  ClientListOnChange(event) {

    this.ClientId = event.target.value;

    if (!event.target.value || event.target.value == "") {

      this.selecterror = true;
    }
    else {
      this.searchBtnDisable = false
      this.selecterror = false;
      this.checkRecords = false
      this.ClientId = event.target.value;
      this.check()
    }
    // this.GetSelectedReferenceFile()
  }

  setBtn() {
    this.searchBtnDisable = false
  }

  GetSelectedReferenceFile() {

    // if (this.ClientId == undefined || this.ClientId == 0) {
    //   this.selecterror = true;
    // }

    // else {
    //   this.searchBtnDisable = true
    //   this.selecterror = false;
    // }

    // let fileobj = { Client_Id: this.ClientId };
    this.service.GetAllReferenceFile().subscribe(data => {
      let res = data.json()
      this.referencefiles = data.json().Data;
      this.RowData = data.json().Data;
      this.searchBtnDisable = false
      this.checkRecords = false;
      this.ResponseHelper.GetSuccessResponse(data)
    }, err => {
      this.ResponseHelper.GetFaliureResponse(err)

      if (this.ClientId != undefined) {
        this.referencefiles = null;
        this.checkRecords = true;
        this.searchBtnDisable = true
      }
      this.RowData = []

    });


  }


  CheckIs_Active(status: boolean) {

    if (status = true) {
      return "fa fa-check";
    }
    else {
      return "fa fa-times";
    }
  }



  CheckFileFormat(format: string) {
    // if (format == 'xlsx') {
    //   return 'fa-file-excel';

    // }
    // else
    if (format == 'pdf' || format == 'PDF') {
      return 'fa-file-pdf';
    }
    // else if (format == "docx"|| format=='DOCX') {
    //   return 'fa-file-word';
    // }
    // else if (format == "png"|| format=='PNG') {
    //   return 'fa-file-powerpoint'
    // }
    // else if (format == "txt"|| format=='TXT') {
    //   return 'fa fa-file-text'
    // }
    // else if (format == "jpeg" || format == "jpg"|| format=="JPG"|| format=="JPEG") {
    //   return 'fa-file-powerpoint'
    // }
    // else {
    //   return 'fa-file'
    // }
  }


  GetUploadFileData(event) {

    if (event.target.files && event.target.files.length > 0) {

      this.File = event.target.files[0];
      this.Filename = this.File.name;
      this.Size = this.File.size / 1024 / 1024;
      console.log('this.Size : ', this.Size);
      if (this.Size > 5) {

        this.DisplaySizeError = true;
      } else {
        this.check();
        // this.uploadBtnDisable = false
        // this.DisplaySizeError = false;

      }
      this.ConvertToBase64()
    }
    else {
      this.File = null;
      this.FileBase64 = null;
      this.Filename = "No File chosen"
    }
  }

  check() {
    if (this.ClientId && this.File) {
      this.uploadBtnDisable = false

    } else {
      this.uploadBtnDisable = true

    }
  }

  ConvertToBase64() {
    let reader = new FileReader();
    reader.readAsDataURL(this.File);
    reader.onload = () => {
      this.FileBase64 = reader.result.toString().split(',')[1];
    }
  }


  ReferenceFileUpload() {

    //     ;
    // this.DisableFileList = true;
    this.DisplayFileError = false;

    if (this.File != null) {

      this.uploadBtnDisable = true;
      let dataobj = { File: this.FileBase64, File_Name: this.Filename, Client_Id: this.ClientId };
      this.service.ReferenceFileUpload(dataobj).subscribe(
        res => {
          this.uploadBtnDisable = false;
          this.ResponseHelper.GetSuccessResponse(res)
          this.File = null
          this.Filename = "No File Chosen";
          this.FileBase64 = null;
          this.GetSelectedReferenceFile();

        },
        err => {
          this.uploadBtnDisable = false;
          this.ResponseHelper.GetFaliureResponse(err)
        }
      );
    }
    else {
      this.DisplayFileError = true;
    }
  }
  AutoSizeGrid(event) {
    event.columnApi.autoSizeColumns(["Practice_Name", "Provider_Name", "Type", "GeBBS_Action"]);
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

  OnRowClicked(event) {
    // this.selectedRecord = true
    // this.ShowRoleError = false;
    // this.InstructionId = event.data.Id;
    // this.GetSingleClientInsurance();
  }
  onCellClicked(data) {

    // switch (data.colDef.headerName) {
    //   case "Count": {
    //     this.instructionservice.getCountData(this.ClientId, data.data.Id).pipe(finalize(() => {
    //       this.viewCountData = true
    //     })).subscribe(res => {
    //       this.ResponseHelper.GetSuccessResponse(res)
    //       data = res.json()
    //       this.readCountData = res.json()
    //       //  this.ClientUpdateData = data.Data
    //     }, err => {
    //       this.ResponseHelper.GetFaliureResponse(err);

    //     })
    //     break;
    //   }
    //   default:
    //     break;
    // }
  }


}
