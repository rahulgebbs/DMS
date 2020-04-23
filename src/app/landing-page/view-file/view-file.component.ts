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
    this.submit = this.fb.group({
      "ClientId": [this.data],
    })


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
      { headerName: "Read", field: "Read_By_Agent", cellRenderer: this.ReadtHandler }
    ]
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.ClientList = userdata.Clients;
    console.log('this.ClientList : ', this.ClientList);
    // this.data = this.ClientList[0].Client_Id;
    this.submit.patchValue({ ClientId: this.ClientList[0].Client_Id });
    this.GetAllReferenceFile();

  }
  AttachmentHandler(params) {
    return '<button style="width: auto;" class="btn label label-info square-btn cursor"><i class="fa fa-file-pdf"></i></button>';
  }

  ReadtHandler(params) {
    console.log('ReadtHandler : ', params);
    if (params.data.Read_By_Agent == true) {
      return '<button style="width: 70%;" class="btn label label-info square-btn cursor">Read</button>';;
    }
    return '<button style="width: 70%;" class="btn label label-info square-btn cursor">Unread</button>';;
  }

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


    let fileobj = { Client_Id: this.submit.value.ClientId, agent_id: this.UserId };
    this.RowData = null;
    this.service.GetAllReferenceFile(fileobj).subscribe(data => {
      this.checkRecords = false;
      this.searchBtnDisable = false
      this.RowData = data.json().Data;
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
    if (format == 'pdf' || format == 'PDF') {
      return 'fa-file-pdf';
    }

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
        this.router.navigate([`/document-view/${event.data.Id}/${event.data.Client_Id}/${event.data.File_Name}/${event.data.Reference_File_Name}`])
        break;
      }
      default:
        break;
    }
  }

}

