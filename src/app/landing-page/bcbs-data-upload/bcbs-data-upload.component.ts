
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common-service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Token } from 'src/app/manager/token';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { finalize } from 'rxjs/operators';
import { BCBSDataUploadService } from 'src/app/service/bcbs-data-upload.service';
import { ExcelService } from 'src/app/service/client-configuration/excel.service';

@Component({
  selector: 'app-bcbs-data-upload',
  templateUrl: './bcbs-data-upload.component.html',
  styleUrls: ['./bcbs-data-upload.component.css']
})
export class BcbsDataUploadComponent implements OnInit {

  Title = 'BCBS Data Upload';
  UserId;
  ResponseHelper;
  ClientList: any[] = [];
  DisableFileInput = false;
  DisableUpload: boolean = false;
  disableDownload: boolean = false;
  DisplayFileError = false;
  Filename = "No File chosen";
  File = null;
  FileBase64;
  truefile: boolean = false
  
  constructor(private commonservice: CommonService, private router: Router,private notificationservice: NotificationService,private service:BCBSDataUploadService,private excelService: ExcelService) 
  { 
    
  }

  ngOnInit() {
    let token = new Token(this.router);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }
  ClearFileData() {
    this.File = null
    this.Filename = "No File Chosen";
    this.FileBase64 = null;
  }

  GetFileData(event) {

    // let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.truefile = true
      this.File = event.target.files[0];
      this.Filename = this.File.name;
      this.ConvertToBase64()
    }
    else {
      this.truefile = false
      this.ClearFileData();
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
    if (this.File != null) {
      this.DisplayFileError = false;
      this.DisableUpload = true;
      this.DisableFileInput = true;
      let dataobj = { File: this.FileBase64, File_Name: this.Filename};
      this.service.bcbsDataUpload(dataobj).pipe(finalize(() => {
        this.DisableUpload = false;
        this.Filename = null;
        this.File = null;
        this.DisableFileInput = false;
        this.ClearFileData();
      })).subscribe(
        res => {
          this.truefile = false
          this.ResponseHelper.GetSuccessResponse(res)
        },
        err => {
          this.truefile = false
          this.ResponseHelper.GetFaliureResponse(err)
        }
      );
    }
    else {
      this.DisplayFileError = true;
    }
  }

  downloadTemplate() {
    this.disableDownload = true
    this.service.downloadbcbsTemplate().subscribe(res => {
      this.disableDownload = false
      this.excelService.downloadExcel(res)
    }, err => {
      this.disableDownload = false
      this.ResponseHelper.GetFaliureResponse(err)
    })
  }

}
