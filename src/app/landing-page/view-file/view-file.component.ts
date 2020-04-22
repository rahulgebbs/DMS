import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { CommonService } from 'src/app/service/common-service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { Token } from 'src/app/manager/token';
import { ViewFileService } from 'src/app/service/view-file.service';
import * as FileSaver from 'file-saver';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-view-file',
  templateUrl: './view-file.component.html',
  styleUrls: ['./view-file.component.css']
})
export class ViewFileComponent implements OnInit {
  title: string = "View Reference File";
  ResponseHelper;
  UserId: number;
  ClientList: any[] = [];
  referencefileList = [];
  token: Token;
  File_Name: string;
  ClientId: number;
  selecterror: boolean = false;
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  Pdf_type = 'application/pdf';
  Pdf_Extension = '.pdf';
  word_type = 'text/csv';
  word_Extension = '.doc';
  Format: string;
  rawdata: any;
  checkRecords: boolean = false;
  selectedValue = null
  submit: FormGroup;
  data
  searchBtnDisable
  GridApi;
  GridColumnApi;
  ColumnDefs = []
  RowData = [];

  constructor(public fb: FormBuilder, private service: ViewFileService, private router: Router, private commonservice: CommonService, private notificationservice: NotificationService) {

    this.token = new Token(this.router);
    // this.userData = this.token.GetUserData();
    this.submit = this.fb.group({
      "ClientId": [this.data],
    })


  }

  submitFrom() {
  }

  ngOnInit() {
    let token = new Token(this.router)
    this.ColumnDefs = [
      { headerName: "Uploaded Date & Time", field: "Uploaded_On" },
      { headerName: "Uploaded by", field: "Uploaded_By" },
      { headerName: "Client Name", field: "Client_Name" },
      { headerName: "Uploader Role", field: "Uploader_Role" },
      { headerName: "File Name", field: "File_Name" },
      { headerName: "Attachment", cellRenderer: this.AttachmentHandler },
      { headerName: "Read", field: "Read_By_Agent" }
    ]
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.ClientList = userdata.Clients;
    console.log('this.ClientList : ', this.ClientList);
    this.data = this.ClientList[0].Client_Id;
    // this.selectValue(this.ClientList)
    this.submitFrom();
  }
  AttachmentHandler(params) {
    // let val
    let eDiv = document.createElement('div');
    // if (!params.value) {
    //   val = 'Accept'
    //   eDiv.innerHTML = '<i class="fa-file-pdf">' + val + '</i>';
    // } else {
    //   val = "Accepted"
    //   eDiv.innerHTML = '<button  class="btn label gray label-info square-btn cursor"  disabled="" >' + val + '</button>';
    // }
    // eDiv.innerHTML = '<button class="btn label label-info square-btn cursor">Attachment <i class="fa fa-file-pdf"></i></button>';
    return '<button style="width: 70%;" class="btn label label-info square-btn cursor">Attachment <i class="fa fa-file-pdf"></i></button>';;
  }

  // selectValue(data) {     
  //   if (data.length == 1 && data.length) {       
  //     data[0].selected = true;
  //     this.ClientId = data[0].Client_Id
  //     this.submit.value.ClientId=this.ClientId
  //     this.GetAllReferenceFile(null)
  //   }else{

  //   }

  // }

  ClientListOnChange(event) {
    this.checkRecords = false;

    this.ClientId = event.target.value;

    if (!event.target.value || event.target.value == "") {

      this.selecterror = true;
    }
    else {
      this.selecterror = false;

      this.ClientId = event.target.value;
    }
  }


  GetAllReferenceFile() {

    console.log('this.submit : ', this.submit.value)
    if (this.submit.value.ClientId == undefined || this.submit.value.ClientId == 0) {

      this.selecterror = true;
    }
    else {

      this.selecterror = false;
    }


    let fileobj = { Client_Id: this.ClientId, agent_id: this.UserId };

    this.service.GetAllReferenceFile(fileobj).subscribe(data => {
      this.checkRecords = false;
      this.searchBtnDisable = false
      // this.referencefileList = data.json().Data;
      this.RowData = data.json().Data;
      // this.referencefileList = data.json().Data;
      this.checkRecords = false;
    }, err => {

      this.ResponseHelper.GetFaliureResponse(err)
      if (this.submit.value.ClientId != undefined) {

        this.RowData = null;
        this.searchBtnDisable = true
        this.checkRecords = true;

      }

    });
  }

  setBtn() {
    this.searchBtnDisable = false
  }
  CheckFormat(format: string) {

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
    //   return 'fa-file-alt'
    // }
    // else if (format == "jpeg" || format == "jpg"|| format=="JPG"|| format=="JPEG") {
    //   return 'fa-file-powerpoint'
    // }
    // else {
    //   return 'fa-file'
    // }
  }


  downloadDocument(data) {
    let dataobj = { Reference_File_Name: data.Reference_File_Name, Display_File_Name: data.Display_File_Name };

    this.File_Name = data.Display_File_Name;

    this.Format = data.File_Format;

    this.service.downloadDocument(dataobj).subscribe(data => {

      var url = window.URL.createObjectURL(data.data);

      let abc = data.data;

      this.savewithextension(abc, this.File_Name, this.Format)

    }, err => {
      this.ResponseHelper.GetFaliureResponse(err)
    })
  }



  private savewithextension(buffer: any, fileName: string, format: string): void {

    if (format == 'xlsx') {
      const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
      FileSaver.saveAs(data, fileName);
    }
    else if (format == 'pdf') {
      const data: Blob = new Blob([buffer], { type: this.Pdf_type });
      FileSaver.saveAs(data, fileName);
    }
    else {
      const data: Blob = new Blob([buffer], { type: this.word_type });
      FileSaver.saveAs(data, fileName);
    }

  }
  AutoSizeGrid(event) {
    event.columnApi.autoSizeColumns();
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
  onCellClicked(event) {
    console.log('onCellClicked : ', event);
    switch (event.colDef.headerName) {
      case "Attachment": {
        // const url = this.router.serializeUrl(
        //   );
        this.router.navigate([`/document-view/${event.data.File_Name}/${event.data.Reference_File_Name}`])

        // window.open(url, '_blank');
        // this.instructionservice.getCountData(this.ClientId, data.data.Id).pipe(finalize(() => {
        //   this.viewCountData = true
        // })).subscribe(res => {
        //   this.ResponseHelper.GetSuccessResponse(res)
        //   data = res.json()
        //   this.readCountData = res.json()
        //   //  this.ClientUpdateData = data.Data
        // }, err => {
        //   this.ResponseHelper.GetFaliureResponse(err);

        // })
        break;
      }
      default:
        break;
    }
  }

}

