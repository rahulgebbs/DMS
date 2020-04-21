import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { DropdownService } from 'src/app/service/client-configuration/dropdown.service';
import { Token } from 'src/app//manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { ExcelService } from 'src/app/service/client-configuration/excel.service';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  providers: [ExcelService]
})
export class DropdownComponent implements OnInit {
  @Input() ClientData;
  @Input() InventoryId;
  uploadBtnDisable: boolean = true;
  downlaodDisable:boolean=false
  File;
  ResponseHelper;
  update: boolean = true
  Dropdownvalues
  Filename = 'No File Chosen';
  FileBase64
  userData;
  Dropdown;
  DisplayMessage = "Loading"
  fileSelected: boolean = true;
  validate: boolean = false
  valueDropdown;
  singleDropDown;
  values;
  showPopup: boolean = false;
  token: Token;
  checkvalidation: boolean = false;
  Client_Id;
  Client_Inventory_Id;
  Is_Active = true;
  Updated_Date
  Id;
  popupVal = "Update";
  showFileError = false;
  data: any[] = []

  @Output() next_page = new EventEmitter<any>();
  constructor(private excelService: ExcelService, private router: Router, private service: DropdownService, private notificationService: NotificationService) {
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();

  }

  ngOnInit() {
    if (this.ClientData.Is_Dropdown_Required) {
      this.getDropdownlookup();
    } else this.DisplayMessage = "No Dropdown Data";
      this.ResponseHelper = new ResponseHelper(this.notificationService);
  }

  getDropdownlookup() {
    this.values = [];
    this.service.getLookup(this.ClientData.Id).subscribe(res => {
      let data = res.json()

      this.Dropdown = data.Data;
      this.Dropdown = data.Data.map(function (obj) {
        obj.Filename = "No File Chosen"
        obj.uploadBtnDisable = true
        return obj
      });
    }, err => {
      this.DisplayMessage = "No Dropdown Data";
      this.ResponseHelper.GetFaliureResponse(err)
    })
  }

  getSingleDropdown(i) {
    var id = i.Id
    this.singleDropDown = i;
    this.Client_Inventory_Id = id;
    this.Id = i.Id;
    this.getDropdownVlaues(id)
    this.valueDropdown = [];
    this.Client_Id = this.ClientData.Id;
  }

  getDropdownVlaues(id) {

    this.service.getDropdownValue(this.ClientData.Id, id).pipe(finalize(() => {
      this.data = [{
        "Is_Active": this.Is_Active, "Client_Id": this.Client_Id,
        "Client_Inventory_Id": this.Id, "Updated_Date": this.Updated_Date, "Id": this.Client_Inventory_Id
      }];
      this.showPopup = true;
    })).subscribe(res => {

      let data = res.json();
      this.values = []
      this.Dropdownvalues = data.Data;
      for (var i = 0; i < this.Dropdownvalues.length; i++) {
        this.values.push({ "values": this.Dropdownvalues[i].Dropdown_Value, "Id": this.Dropdownvalues[i].Id, "updatedT": this.Dropdownvalues[i].Updated_Date })
      }
      this.showPopup = true
    }, err => {
      this.values = []
      this.ResponseHelper.GetFaliureResponse(err)
    })
  }


  navigate() {
    this.next_page.emit('dropdown');
  }
  closeModel() {
    this.showPopup = false;
    this.ClientData.update = true;
    this.validate = false;
  }
  DownloadTemplate(i) {
    i.downlaodDisable=true
    this.service.downloadTemplate().subscribe(res => {
      this.excelService.downloadExcel(res)
      i.downlaodDisable=false
    }, err => {
      i.downlaodDisable=false
      this.ResponseHelper.GetFaliureResponse(err)
    })
  }

  ToggleModal(event) {
    this.showPopup = false;
  }

  changeListener(event, j,i): void {
    if (event.target.files && event.target.files.length > 0) {
      this.File = event.target.files[0];
      this.Filename = this.File.name;
      this.Dropdown[j].Filename = this.Filename
      this.fileSelected = true
      this.ConvertToBase64()
     i.uploadBtnDisable=false
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

  uploadFile(id, j,i) {

    this.Client_Inventory_Id = id
    if (this.Filename != 'No File Chosen') {
      this.fileSelected = true

    } else {
      this.fileSelected = false
      this.validate = false
    }
    i.uploadBtnDisable=true

    let dataobj = { File: this.FileBase64, File_Name: this.Filename, Client_Id: this.ClientData.Id, Client_Inventory_Id: this.Client_Inventory_Id };
    if (this.FileBase64) {
      this.service.uploadDropdown(dataobj).subscribe(res => {
        this.File = []
        this.ResponseHelper.GetSuccessResponse(res);
        this.ClientData.Is_Dropdown_Uploaded = true;
        this.validate = false
        this.FileBase64 = null
        this.Dropdown[j].Filename = "No File Chosen"
      },
        err => {
          this.ResponseHelper.GetFaliureResponse(err)
        }
      );
    }
  }

  updateCancel() {
    this.update = false;
    this.valueDropdown = []
    this.checkvalidation = false;
    this.Is_Active = true
  }
}
