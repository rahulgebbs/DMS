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
  title: string = "View AR KMS";
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

    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.ClientList = userdata.Clients;   
    this.data = this.ClientList[0].Client_Id;
    this.selectValue(this.ClientList)
    this.submitFrom();
  }

  selectValue(data) {     
    if (data.length == 1 && data.length) {       
      data[0].selected = true;
      this.ClientId = data[0].Client_Id
      this.submit.value.ClientId=this.ClientId
      this.GetAllReferenceFile(null)
    }else{

    }

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


  GetAllReferenceFile(filename: string) {

    if (this.submit.value.ClientId == undefined || this.submit.value.ClientId == 0) {

      this.selecterror = true;
    }
    else {

      this.selecterror = false;
    }


    let fileobj = { Client_Id: this.submit.value.ClientId, File_Name: filename };

    this.service.GetAllReferenceFile(fileobj).subscribe(data => {
      this.checkRecords = false;
      this.searchBtnDisable = false
      this.referencefileList = data.json().Data;

      this.referencefileList = data.json().Data;
      this.checkRecords = false;
    }, err => {
      
      this.ResponseHelper.GetFaliureResponse(err)
      if (this.submit.value.ClientId != undefined) {

        this.referencefileList = null;
        this.searchBtnDisable = true
        this.checkRecords = true;

      }

    });
  }

  setBtn() {
    this.searchBtnDisable = false
  }
  CheckFormat(format: string) {

    if (format == 'xlsx') {
      return 'fa-file-excel';

    }
    else if (format == 'pdf'|| format=='PDF') {
      return 'fa-file-pdf';
    }
    else if (format == "docx"|| format=='DOCX') {
      return 'fa-file-word';
    }
    else if (format == "png"|| format=='PNG') {
      return 'fa-file-powerpoint'
    }
    else if (format == "txt"|| format=='TXT') {
      return 'fa-file-alt'
    }
    else if (format == "jpeg" || format == "jpg"|| format=="JPG"|| format=="JPEG") {
      return 'fa-file-powerpoint'
    }
    else {
      return 'fa-file'
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

}

