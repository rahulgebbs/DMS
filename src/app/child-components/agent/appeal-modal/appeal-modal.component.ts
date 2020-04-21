import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AgentService } from 'src/app/service/agent.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { environment } from 'src/environments/environment';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-appeal-modal',
  templateUrl: './appeal-modal.component.html',
  styleUrls: ['./appeal-modal.component.css']
})
export class AppealModalComponent implements OnInit {
  @Input() AppealType;
  @Input() TemplateCheck;
  @Input() ClientId;
  @Input() IdentityProofList;
  @Input() AllFields;
  @Input() GUIDList;
  @Input() Inventory_Id;
  @Input() Client_Name;
  @Output() CloseModal = new EventEmitter<any>();
  @Output() GUIDListChange = new EventEmitter<any>();
  DisplayAppealTab = false;
  File;
  Filename = '';
  FileBase64 = '';
  DisableAll = false;
  DisableMerge = true;
  DisplayPdf = false;
  PdfUrl = '';
  disb: boolean = false

  AppealLetterList = [
    { Template_Name: "CoverLetter", Display_Name: "Cover Letter", Disabled: true },
    { Template_Name: "FaxCoverLetter", Display_Name: "Fax Cover Letter", Disabled: true },
    { Template_Name: "GenericAppealLetter", Display_Name: "Generic Appeal Letter", Disabled: true },
    { Template_Name: "InsuranceSpecificAppealLetter", Display_Name: "Insurance Specific Appeal Letter", Disabled: true },
    { Template_Name: "Reconsideration", Display_Name: "Reconsideration", Disabled: true },
    { Template_Name: "Redetermination", Display_Name: "Redetermination", Disabled: true },
  ];

  ResponseHelper: ResponseHelper;

  //  = [
  //   { Template_Name: "CMS", Display_Name: "CMS", Upload_URL: '', Filename: 'No File Chosen', FileBase64: '' },
  //   { Template_Name: "Primary_EOB", Display_Name: "Primary EOB", Upload_URL: '', Filename: 'No File Chosen', FileBase64: '' },
  //   { Template_Name: "Secondary_EOB", Display_Name: "Secondary EOB", Upload_URL: '', Filename: 'No File Chosen', FileBase64: '' },
  //   { Template_Name: "POTF", Display_Name: "POTF", Upload_URL: '', Filename: 'No File Chosen', FileBase64: '' },
  //   { Template_Name: "Medical_Record", Display_Name: "Medical Record", Upload_URL: '', Filename: 'No File Chosen', FileBase64: '' },
  //   { Template_Name: "W9_Form", Display_Name: "W9 Form", Upload_URL: '', Filename: 'No File Chosen', FileBase64: '' }
  // ]

  constructor(private agentservice: AgentService, private notification: NotificationService) { }

  ngOnInit() {

    this.ResponseHelper = new ResponseHelper(this.notification);
    this.DisplayAppealTab = false;
    if (this.AppealType == 'appeal') {
      this.DisplayAppealTab = true;
      this.checkcoverletter()
    }
    else {
      this.DisplayAppealTab = false;
      this.IdentityProofList.CoverLetter = '';
      this.IdentityProofList.AppealLetter = '';
      this.GUIDList = this.GUIDList.filter(x => x.Template_Name != "Appeal_Letter");
      this.GUIDListChange.emit(this.GUIDList);
      this.checkcoverletter()
    }
    this.CheckIfTemplateUploaded();
  }

  checkcoverletter() {
    if (this.AppealType == 'appeal') {
      if (this.IdentityProofList.CoverLetter != "" && this.IdentityProofList.AppealLetter != "") {
        this.disb = false

      } else {
        this.disb = true
      }
    } else {
      if (this.IdentityProofList.CoverLetter != "") {
        this.disb = false
      } else {
        this.disb = true
      }
    }
  }

  CheckIfTemplateUploaded() {
    if (this.TemplateCheck) {
      this.TemplateCheck.forEach(e => {
        this.AppealLetterList.forEach(a => {
          if (e.Template_Name.split("_").join('') == a.Template_Name) {
            a.Disabled = false;
          }
        })
      });
    }
  }

  OnInputFileChanged(event, i, template_name) {
    if (event.target.files && event.target.files.length > 0) {
      this.File = event.target.files[0];
      this.Filename = this.File.name;
      this.IdentityProofList.TemplateList[i].Filename = this.Filename;
      this.ConvertToBase64(i);
    }
    else {
      this.IdentityProofList.TemplateList[i].Filename = 'No File Chosen';
      this.IdentityProofList.TemplateList[i].FileBase64 = ''
      this.IdentityProofList.TemplateList[i].Upload_URL = ''
      this.GUIDList = this.GUIDList.filter(x => x.Template_Name != template_name);
    }
  }

  ConvertToBase64(i) {
    let reader = new FileReader();
    reader.readAsDataURL(this.File);
    reader.onload = () => {
      this.FileBase64 = reader.result.toString().split(',')[1];
      this.IdentityProofList.TemplateList[i].FileBase64 = this.FileBase64;
    }
  }

  UploadFile(Template_Name, i) {

    if (this.IdentityProofList.TemplateList[i].FileBase64) {
      var dataobj = {
        File: this.IdentityProofList.TemplateList[i].FileBase64,
        File_Name: this.IdentityProofList.TemplateList[i].Filename,
        Client_Id: this.ClientId,
        Client_Name: this.Client_Name,
        Template_Type: Template_Name,
        Inventory_Id: this.Inventory_Id
      }
      this.DisableAll = true;
      this.agentservice.UploadStaticFiles(dataobj).pipe(finalize(() => {
        this.DisableAll = false;
      })).subscribe(
        res => {
          var guid = res.json().Data.Return_Url.split("/")[2].slice(0, -4);
          var pages = res.json().Data.Pages;
          var setguid = false;
          this.GUIDList.forEach(e => {
            if (e.Template_Name == Template_Name) {
              e.GUID = guid;
              e.Pages = pages
              setguid = true;
            }
          });
          if (!setguid) {
            this.GUIDList.push({ Template_Name: Template_Name, GUID: guid, Pages: pages, SaveDate: res.json().Data.Return_Url.split("/")[0] })
          }
          this.GUIDListChange.emit(this.GUIDList);
          // this.IdentityProofList.TemplateList[i].Upload_URL = environment.FileApiUrl + environment.Agent_Appeal_Url + this.ClientId + "/" + this.Inventory_Id + "/" + res.json().Data;
          this.IdentityProofList.TemplateList[i].Upload_URL = environment.FileApiUrl + environment.Agent_Appeal_Url + this.Client_Name + '/' + res.json().Data.Return_Url;
          this.ResponseHelper.GetSuccessResponse(res);
        },
        err => {
          this.ResponseHelper.GetFaliureResponse(err);
        }
      )
    }
  }

  DeleteFile(i, item) {
    console.log(item);
    console.log(this.GUIDList);
    var uploadDate = '';
    var filename = '';
    this.GUIDList.forEach(e => {
      if (e.Template_Name == item.Template_Name) {
        uploadDate = e.SaveDate;
        filename = e.GUID + '.pdf';
      }
    });
    this.DisableAll = true;
    var obj = { Client_Name: this.Client_Name, Upload_Date: uploadDate, Inventory_Id: this.Inventory_Id, File_Name: filename, Client_Id: this.ClientId };
    this.agentservice.DeleteAppealFile(obj).pipe(finalize(() => {
      this.DisableAll = false;
    })).subscribe(
      res => {
        this.IdentityProofList.TemplateList[i].Filename = 'No File Chosen';
        this.IdentityProofList.TemplateList[i].FileBase64 = ''
        this.IdentityProofList.TemplateList[i].Upload_URL = ''
        this.GUIDList = this.GUIDList.filter(x => x.Template_Name != item.Template_Name);
        this.ResponseHelper.GetSuccessResponse(res);
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    )

  }

  Generate() {
    //is appeal non appeal
    var formobj = {
      Client_Id: this.ClientId,
      Client_Name: this.Client_Name,
      Inventory_Id: this.Inventory_Id,
      CoverLetter: this.IdentityProofList.CoverLetter.split(" ").join("_"),
      AppealLetter: this.IdentityProofList.AppealLetter.split(" ").join("_"),
      Inventory: this.AllFields,
      GUIDList: this.GUIDList,
      AppealType: this.AppealType
    }
    this.DisableAll = true;
    this.agentservice.GeneratePdf(formobj).pipe(finalize(() => {
      this.DisableAll = false;
    })).subscribe(
      res => {
        this.GUIDList = res.json().Data;
        this.DisableMerge = false;
        this.GUIDListChange.emit(this.GUIDList);
        this.ResponseHelper.GetSuccessResponse(res);
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    )
  }

  ReviewMergePdf() {
    // this.GUIDList = [
    //   { Template_Name: "Cover_Letter", GUID: "09677da8-361d-4c66-b0f8-a958e3112758" },
    //   { Template_Name: "Appeal_Letter", GUID: "a398564d-be5d-47b4-89f4-a9300f087a7b" },
    //   { Template_Name: "CMS", GUID: "de06796c-e3fc-4de6-b544-8254f7366295" }
    // ]  
    var formobj = {
      GUIDList: this.GUIDList,
      Client_Id: this.ClientId,
      Client_Name: this.Client_Name,
      Inventory_Id: this.Inventory_Id
    }
    this.DisableAll = true;
    this.agentservice.ReviewMergePdf(formobj).pipe(finalize(() => {
      this.DisableAll = false;
    })).subscribe(
      res => {

        this.IdentityProofList.Merged_Template_Url = environment.FileApiUrl + environment.Agent_Appeal_Url + this.Client_Name + '/' + res.json().Data;
        this.ResponseHelper.GetSuccessResponse(res);
        this.ViewPdf(this.IdentityProofList.Merged_Template_Url);
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    )
  }

  ViewPdf(url) {
    this.PdfUrl = url;
    this.TogglePdfViewer();
  }

  TogglePdfViewer() {
    this.DisplayPdf = !this.DisplayPdf;
  }

  Close() {
    this.CloseModal.emit();
  }

}
