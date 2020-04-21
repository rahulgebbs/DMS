import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { InsuranceService } from 'src/app/service/client-configuration/insurance.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { Router } from '@angular/router';
import { Token } from 'src/app/manager/token';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-setting-template-modal',
  templateUrl: './setting-template-modal.component.html',
  styleUrls: ['./setting-template-modal.component.css']
})
export class SettingTemplateModalComponent implements OnInit {
  @Output() Toggle = new EventEmitter<any>();
  @Input() ClientData;
  @Input() InsuranceId;
  File;
  FileBase64;
  Filename: 'No File Chosen';
  // uploadBtnDisable:boolean=true;
  showPopup: boolean = false;
  userData;
  token: Token;
  ResponseHelper: ResponseHelper;
  Template_Type: string;
  displayview: boolean = false;
  viewBtnDisable: boolean = true;
  viewLabel: string = '';
  ViewModal: boolean = false;
  uploadurl;
  UrlData;
  ReferenceFileName: string;
  viewdata: any;
  File_Name: string;
  uploaded_temp_list: any;
  disableUpload: boolean = false;



  templatelist = [
    { type: "Cover_Letter", uploadname: "No File Chosen", uploadedurl: "", delete: "" },
    { type: "Fax_Cover_Letter", uploadname: "No File Chosen", uploadedurl: "", delete: "" },
    { type: "Generic_Appeal_Letter", uploadname: "No File Chosen", uploadedurl: "", delete: "" },
    { type: "Insurance_Specific_Appeal_Letter", uploadname: "No File Chosen", uploadedurl: "", delete: "" },
    { type: "Reconsideration", uploadname: "No File Chosen", uploadedurl: "", delete: "" },
    { type: "Redetermination", uploadname: "No File Chosen", uploadedurl: "", delete: "" }
  ]



  constructor(private router: Router, private services: InsuranceService, private notificationservice: NotificationService) {
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();
    this.ResponseHelper = new ResponseHelper(this.notificationservice);

  }

  ngOnInit() {

    this.GetUploadedTemplates();
  }


  closeModel() {

    this.Toggle.emit(this.showPopup);

  }

  OnChange(event, type: String, index): void {
    ;
    if (event.target.files && event.target.files.length > 0) {

      this.File = event.target.files[0];
      this.Filename = this.File.name;
      this.templatelist[index].uploadname = this.Filename;
      this.ConvertToBase64();
    }
    else {
      this.File = null;
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


  uploadAppealTemplate(Type: string) {

    this.disableUpload = true

    this.Template_Type = Type;

    var dataobj = new Object();
    if (this.FileBase64) {
      dataobj = {

        File: this.FileBase64,
        File_Name: this.Filename,
        Insurance_Id: this.InsuranceId,
        Client_Id: this.ClientData.Id,
        Template_Type: this.Template_Type

      };
      this.services.UploadAppealTemplate(dataobj).subscribe(data => {
        this.disableUpload = false
        this.FileBase64 = null;
        this.UrlData = data.json().Data;
        this.ReferenceFileName = this.UrlData.Reference_File_Name;

        this.templatelist.forEach(e => {
          if (e.type == this.Template_Type) {
            e.uploadedurl = "enable";
            e.uploadname = 'No File Chosen';
            e.delete = "enable";
          }
        })
        this.ResponseHelper.GetSuccessResponse(data);
      },
        err => {
          this.disableUpload = false
          this.ResponseHelper.GetFaliureResponse(err)
        }
      );
    }

  }

  viewUploadedFile(label: string) {
    this.viewLabel = label.split("_").join(" ");
    if(this.uploaded_temp_list)
    this.uploaded_temp_list.forEach(a => {
      if (label == a.Template_type) {
        this.ReferenceFileName = a.Reference_File_Name;
      }
    })

    var dataobj = new Object();
    dataobj = {
      Reference_File_Name: this.ReferenceFileName,
    }

    this.services.downloadappealTemplate(dataobj).subscribe(res => {
      let data = res.data;
      this.File_Name = res.filename;
      this.savewithextension(data, this.File_Name)
    }, err => {
      this.ResponseHelper.GetFaliureResponse(err)
    })


  }

  private savewithextension(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: "application/pdf" });
    FileSaver.saveAs(data, fileName);
    let reader = new FileReader();
    reader.readAsDataURL(data);

    reader.onloadend = () => {
      this.viewdata = reader.result;
    }


  }

  deleteUploadedFile(type) {
    if(this.uploaded_temp_list)
    this.uploaded_temp_list.forEach(a => {
      if (type == a.Template_type) {
        this.Template_Type = a.Template_type;
      }
    })

    var dataobj = new Object();
    dataobj = {

      Insurance_Id: this.InsuranceId,
      Client_Id: this.ClientData.Id,
      Template_Type: this.Template_Type

    }

    this.services.DeleteAppealTemplate(dataobj).subscribe(data => {

      this.templatelist.forEach(e => {
        e.delete = "";
        e.uploadedurl = "";
      })

      this.ResponseHelper.GetSuccessResponse(data);
      this.GetUploadedTemplates();
    },
      err => {
        this.ResponseHelper.GetFaliureResponse(err)
      }
    );
  }

  GetUploadedTemplates() {

    this.services.GetUploadedTemplates(this.InsuranceId, this.ClientData.Id).subscribe(
      res => {

        this.uploaded_temp_list = res.json().Data;

        this.uploaded_temp_list.forEach(a => {

          this.templatelist.forEach(e => {

            if (e.type == a.Template_type) {

              e.uploadedurl = "enable";

              e.delete = "enable";
            }
          })
        })


      },
      err => {

        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }
}
