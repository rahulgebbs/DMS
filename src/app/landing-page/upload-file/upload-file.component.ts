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
  title: string = "Upload AR KMS";
  Filename = "No File Chosen";
  Size;
  File;
  FileBase64;
  DisplayFileError = false;
  DisplaySizeError = false;
  ResponseHelper;
  UserId: number;
  ClientList:any[] = [];
  selecterror: boolean = false;
  ClientId: number;
  checkRecords: boolean = false;
  uploadBtnDisable: boolean = true;
  searchBtnDisable: boolean = true;
  token: Token;
  referencefiles = [];

  constructor( private service: UploadFileService, private router: Router, private notificationservice: NotificationService) { }

  ngOnInit() {

    // this.GetReferenceFile();

    this.ResponseHelper = new ResponseHelper(this.notificationservice);

    let token = new Token(this.router)
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.ClientList = userdata.Clients;
    this.selectedValue(this.ClientList);
  }

  selectedValue(data) {
     
    if (data.length == 1 && data.length) {       
      data[0].selected = true;
      this.searchBtnDisable= false
      this.ClientId = data[0].Client_Id
      this.GetSelectedReferenceFile('')
    }else{

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
  }

  setBtn() {
    this.searchBtnDisable = false
  }

  GetSelectedReferenceFile(name: string) {
    
    if (this.ClientId == undefined || this.ClientId == 0) {
      this.selecterror = true;
    }

    else {
      this.searchBtnDisable = true
      this.selecterror = false;
    }

    let fileobj = { Client_Id: this.ClientId, File_Name: name };
    this.service.GetAllReferenceFile(fileobj).subscribe(data => {
      let res = data.json()
      this.referencefiles = data.json().Data;
      this.searchBtnDisable = false
      this.checkRecords = false;
    }, err => {
      this.ResponseHelper.GetFaliureResponse(err)

      if (this.ClientId != undefined) {
        this.referencefiles = null;
        this.checkRecords = true;
        this.searchBtnDisable = true
      }

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
      return 'fa fa-file-text'
    }
    else if (format == "jpeg" || format == "jpg"|| format=="JPG"|| format=="JPEG") {
      return 'fa-file-powerpoint'
    }
    else {
      return 'fa-file'
    }
  }


  GetUploadFileData(event) {

    if (event.target.files && event.target.files.length > 0) {

      this.File = event.target.files[0];
      this.Filename = this.File.name;
      this.Size = this.File.size / 1024 / 1024;

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

  check(){
    if(this.ClientId && this.File){
      this.uploadBtnDisable=false

    }else{
      this.uploadBtnDisable=true
  
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
      
      this.uploadBtnDisable = true
      let dataobj = { File: this.FileBase64, File_Name: this.Filename, Client_Id: this.ClientId };
      this.service.ReferenceFileUpload(dataobj).subscribe(
        res => {
          this.ResponseHelper.GetSuccessResponse(res)
          this.File = null
          this.Filename = "No File Chosen";
          this.FileBase64 = null;
          this.GetSelectedReferenceFile("");

        },
        err => {

          this.ResponseHelper.GetFaliureResponse(err)
        }
      );
    }
    else {
      this.DisplayFileError = true;
    }
  }

}
