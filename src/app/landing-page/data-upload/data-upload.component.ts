import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common-service';
import { Token } from 'src/app/manager/token';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { DataUploadService } from 'src/app/service/data-upload.service';
import { finalize } from 'rxjs/operators';
import { ExcelService } from 'src/app/service/client-configuration/excel.service'
import { FormGroup, FormBuilder } from '@angular/forms';
import { dropDownFields } from 'src/app/manager/dropdown-feilds'
@Component({
  selector: 'app-data-upload',
  templateUrl: './data-upload.component.html',
  styleUrls: ['./data-upload.component.css'],
  providers: [ExcelService, dropDownFields]
})
export class DataUploadComponent implements OnInit {
  Title = "Inventory Upload";
  UserId;
  ResponseHelper;
  ClientId;
  ClientList: any[] = [];
  DisableFileInput = true;
  DisableUpload: boolean = true;
  disableDownload: boolean = true;
  dataUpload: FormGroup;
  DisplayFileError = false;
  Filename = "No File chosen";
  File = null;
  FileBase64;
  selected: boolean = false;
  singleclient: boolean = false;
  truefile: boolean = false
  constructor(private selectField: dropDownFields, private fb: FormBuilder, private excelService: ExcelService, private router: Router, private commonservice: CommonService, private notificationservice: NotificationService, private service: DataUploadService) {
    this.dataUpload = this.fb.group({
      "Client_Id": [""],
      "type": null
    })
  }

  ngOnInit() {
    let token = new Token(this.router);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    this.ClientList = this.selectField.setSelected(userdata.Clients);
    if (this.ClientList[0].selected == true) {
      this.ClientId = this.ClientList[0].Client_Id
      this.DisableFileInput = false
      this.DisableUpload = false;
      this.disableDownload = false
      this.singleclient = true
    } else {
      this.DisableUpload = true
      this.disableDownload = true
      this.singleclient = false
    }
  }

  selectedValue(data) {

    if (data.length == 1 && data.length) {

      data[0].selected = true;
      this.ClientId = data[0].Client_Id
      this.DisableFileInput = false
      this.DisableUpload = false;
      this.disableDownload = false
      this.singleclient = true
    } else {
      this.DisableUpload = true
      this.disableDownload = true
      this.singleclient = false
    }

  }



  ClientListOnChange(event) {
    if (!event.target.value || event.target.value == "") {
      this.DisableFileInput = true;
      this.DisableUpload = true;
      this.disableDownload = true
      this.ClearFileData();
    }
    else {
      this.DisableFileInput = false;
      this.DisableUpload = false;
      this.disableDownload = false
      this.ClientId = event.target.value;
    }
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
      let dataobj = { File: this.FileBase64, File_Name: this.Filename, Client_Id: this.ClientId };
      this.service.InventoryDataUpload(dataobj).pipe(finalize(() => {
        this.DisableUpload = false;
        this.Filename = null;
        this.File = null;
        if (this.ClientList.length == 1) {
          this.disableDownload = false
        } else {
          this.disableDownload = true
        }
        this.DisableFileInput = false;
        this.ClearFileData();
        if (!this.singleclient) {
          this.ClientId = "";
        }
        // this.Is_Special_Queue = false;
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
    this.service.downloadInventoryTemplate(this.ClientId).subscribe(res => {
      let data = res.json().Data
      this.excelService.exportAsExcelFile(data, 'InventoryTemplate')
    }, err => {
      this.ResponseHelper.GetFaliureResponse(err)
    })
  }
  
  openModal(event) {
    console.log('OpenByAgent : ', this.dataUpload.value);
  }

  closeModal(event) {
    console.log('closeModal event : ',event)
    this.dataUpload.patchValue({ type: null });
  }
}
