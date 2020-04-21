import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { Token } from 'src/app/manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ExceptionEntryService } from 'src/app/service/exception-entry.service';

@Component({
  selector: 'app-exception-entry',
  templateUrl: './exception-entry.component.html',
  styleUrls: ['./exception-entry.component.css']
})
export class ExceptionEntryComponent implements OnInit {
  Title = "Add New Exception";
  showLoading:boolean=true;
  ResponseHelper: ResponseHelper
  UserId = 0;
  ClientList: any[] = [];
  ClientId: number;
  addException: FormGroup;
  disableUpload: boolean = true;
  exceptioData;
  DisplayMain: boolean = false;
  validated: boolean = false;
  File;
  Filename = "No File Selected";
  uploadBtnDisable = true;
  FileBase64;

  constructor(private service: ExceptionEntryService, private fb: FormBuilder, private router: Router, private notificationservice: NotificationService) {

  }

  ngOnInit() {

    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    var token = new Token(this.router);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.ClientList = userdata.Clients;
    this.selectedValue(this.ClientList)
    // this.GetClientList();
  }

  submitFrom() {
    this.validated = true
    this.addException.valid
    this.addException.patchValue({ "Reference_File_Name": this.Filename })
    if (this.addException.valid) {
      let Upload_Request = { "File_Name": this.Filename, "Client_Id": this.ClientId, "File": this.FileBase64 };
      var obj = {};

      let Fields = this.addException.value

      obj['Upload_Request'] = Upload_Request;
      obj['Fields'] = Fields;
      // this.addException.patchValue({"Reference_File_Name":""})
      if (this.Filename != "No File Selected") {
        this.service.submit(obj).subscribe(res => {
          this.ResponseHelper.GetSuccessResponse(res);
          // window.location.reload();
          this.File = [];
          this.FileBase64 = [];
          this.Filename = "No File Selected";
          this.validated = false
          this.Getexception()
          this.uploadBtnDisable = true;
        }, err => {
          this.ResponseHelper.GetFaliureResponse(err);
        })
      }
    }
  }

  clearData() {
    this.addException.reset()
    this.File = [];
    this.FileBase64 = [];
    this.Filename = "No File Selected";
  }

  BlockInput(event) {
    if (event.key == 'Backspace' || event.key == 'Tab') {
      return true;
    }
    else {
      return false;
    }

  }


  selectedValue(data) {

    if (data.length == 1 && data.length) {
      data[0].selected = true;
      this.ClientId = data[0].Client_Id
      this.Getexception()

    }
  }
  Getexception() {
    this.addException = this.fb.group({
      "Client_Id": [this.ClientId],
    })
    this.service.getException(this.ClientId).subscribe(res => {
      let data = res.json().Data;
      let data1 = data.sort((a, b) => Number(a.Column_Display_Order) - Number(b.Column_Display_Order));
      this.exceptioData = data1
      this.createFrom(this.exceptioData)
      this.DisplayMain = true;
      this.showLoading=false
    }, err => {
      this.showLoading=false
      this.ResponseHelper.GetFaliureResponse(err);
    })
  }
  createFrom(data) {
    for (let i = 0; i < data.length; i++) {
      this.addException.addControl(data[i].Header_Name, this.fb.control('', Validators.compose([Validators.required, Validators.maxLength(data[i].Field_Limit)])))
    }

  }

  ClientOnChange(e) {
    this.ClientId = e.target.value;
    this.Getexception();

  }

  uploadFile() {

  }
  changeListener(event): void {
    if (event.target.files && event.target.files.length > 0) {
      this.validated = false
      this.File = event.target.files[0];
      this.Filename = this.File.name;
      this.uploadBtnDisable = false
      this.ConvertToBase64()
    }
    else {
      this.File = null;
      this.validated = true;
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
}
