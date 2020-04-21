import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { InventoryService } from 'src/app/service/client-configuration/inventory.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { finalize } from 'rxjs/operators';
import { Token } from 'src/app/manager/token';
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  providers: [InventoryService]
})
export class InventoryComponent implements OnInit {
  @Input() ClientData;
  @Output() next_page = new EventEmitter<any>();
  @ViewChild('myFileInput') myFileInput;
  DisplayModal = false;
  Filename = "No File Chosen";
  ClientId;
  LoadingMsg = "Loading";
  File;
  FileBase64;
  DisplayColumnError = false;
  DisplayHeaderError = false;
  DisplayFileError = false;
  DisplayUnallowedError = false;
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  DisableNext = false;
  YesNoList = [{ Name: "Yes" }, { Name: "No" }]
  DataTypeList: { Name: string }[] = [{ Name: "Text" }, { Name: "Date" }, { Name: "Formula" }];
  DisabledHeaderList: string[] = ["Practice", "Date of Service", "Patient Name", "Provider Name", "Payer"];
  UnallowedList: string[] = ["Unique_key", "Last_Worked_Date", "Communication_Channel", "Upload_Date", "Refer_Date", "Effectiveness", "Max_Date", "Over_Due_Value", "Time_Filling_Limit", "Date_of_Service_Age", "TFL_Status", "TFL_Value"];
  InventoryData: InventoryModel[];
  ResponseHelper;
  token: Token
  downloadDisable: boolean = false;
  DisplayNameError = false;
  constructor(private service: InventoryService, private notificationservice: NotificationService, private notification: NotificationService) {
  }
  ngOnInit() {
    this.LoadingMsg = "Loading";
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    this.ClientId = this.ClientData.Id;
    if (this.ClientData.Is_Inventory_Uploaded) {
      this.GetAllInventory();
    }
    else {
      //  this.InventoryData = new Array<InventoryModel>(); commented by Yash
      this.LoadingMsg = "Upload Excel or Add Inventory Headers To see data";
    }

  }

  GetAllInventory() {
    this.DisableNext = true;
    this.service.GetAllInventory(this.ClientId).pipe(finalize(() => {
      this.DisableNext = false;
    })).subscribe(
      data => {

        // this.ResponseHelper.GetSuccessResponse(data, data.json());
        this.ConvertBoolToYesNo(data.json().Data);
        if (this.InventoryData.length != 0) {
          if (this.InventoryData.some(x => x.Is_Dropdown_Field == "Yes")) {
            this.ClientData.Is_Dropdown_Required = true;
          }
          if (this.InventoryData.some(x => x.Is_Formula_Computable == "Yes")) {
            this.ClientData.Is_Formula_Required = true;
          }
        }
      },
      err => {

        this.LoadingMsg = "Upload Excel or Add Inventory Headers To see data";
        this.ResponseHelper.GetFaliureResponse(err);
      }
    )
  }

  ConvertBoolToYesNo(Data: InventoryModel[]): any {
    let arr = []

    Data.forEach(e => {
      if (e.Is_Dropdown_Field) {
        e.Is_Dropdown_Field = "Yes"
      }
      else e.Is_Dropdown_Field = "No"
      if (e.Is_Edit_Allowed_Agent) {
        e.Is_Edit_Allowed_Agent = "Yes"
      }
      else e.Is_Edit_Allowed_Agent = "No"
      if (e.Is_Formula_Computable) {
        e.Is_Formula_Computable = "Yes"
      }
      else e.Is_Formula_Computable = "No"
      if (e.Is_Standard_Field) {
        e.Is_Standard_Field = "Yes"
      }
      else e.Is_Standard_Field = "No"
      if (e.Is_Unique_Field) {
        e.Is_Unique_Field = "Yes"
      }
      else e.Is_Unique_Field = "No"
      if (e.Is_View_Allowed_Agent) {
        e.Is_View_Allowed_Agent = "Yes"
      }
      else e.Is_View_Allowed_Agent = "No"
      if (e.Is_Appeal) {
        e.Is_Appeal = "Yes"
      }
      else e.Is_Appeal = "No"

      if (e.Is_Correspondence) {

        e.Is_Correspondence = "Yes"
      }
      else e.Is_Correspondence = "No"
      arr.push(e);
      e.Is_Standard_Changed = false;
      e.Is_Formula_Changed = false;
    });
    this.InventoryData = arr;
  }

  FormulaDropdownChange(i) {
    this.InventoryData[i].Is_Formula_Changed = true;
    if (this.InventoryData[i].Column_Datatype == "Formula" && this.InventoryData[i].Is_Formula_Computable == "Yes") {
      this.InventoryData[i].Column_Datatype = "Text"
    }
  }

  // IsDropdownOnChange(i) {
  //   if (this.InventoryData[i].Column_Datatype == "Formula" && this.InventoryData[i].Is_Dropdown_Field == "Yes") {
  //     this.InventoryData[i].Column_Datatype = "Text"
  //   }
  // }

  StandardDropdownChange(i) {
    this.InventoryData[i].Is_Standard_Changed = true;
    if (this.InventoryData[i].Is_Standard_Field == "Yes" && this.InventoryData[i].Is_Appeal == "Yes") {
      this.InventoryData[i].Is_Appeal = "No"
    }
  }

  AppealDropdownChange(i) {
    if (this.InventoryData[i].Is_Appeal == "Yes" && this.InventoryData[i].Is_Standard_Field == "Yes") {
      this.InventoryData[i].Is_Standard_Field = "No"
    }
  }

  CorrespondenceDropdown(i) {

  }

  // DatatypeOnChange(i) {
  //   if (this.InventoryData[i].Column_Datatype == "Formula") {
  //     this.InventoryData[i].Is_Formula_Computable = "No";
  //     this.InventoryData[i].Is_Dropdown_Field = "No"
  //   }
  // }

  CheckDuplicateDisplayName(col, i): number {
    let name = col.name.split("-")[0];
    this.DisplayNameError = false;

    if (col.value) {
      var str = '';
      str = col.value;
      str = str.toLowerCase();
      let a = this.InventoryData.filter(e => e['Display_Name'].toLowerCase() == str);
      if (a.length > 1) {
        this.DisplayNameError = true;
      }
    }
    return i;
  }

  CheckDuplicateHeaderName(col, i) {
    let name = col.name.split("-")[0];
    this.DisplayHeaderError = false;


    if (col.value) {
      var str = '';
      str = col.value;
      str = str.toLowerCase();
      let a = this.InventoryData.filter(e => e['Header_Name'].toLowerCase() == str);
      if (a.length > 1) {
        this.DisplayHeaderError = true;
      }
    }
    return i;
  }

  CheckDuplicateDisplayOrder(col, i) {
    let name = col.name.split("-")[0];
    this.DisplayColumnError = false;
    if (col.value) {
      let a = this.InventoryData.filter(e => e['Column_Display_Order'] == col.value);
      if (a.length > 1) {
        this.DisplayColumnError = true;
      }
    }
    return i;
  }

  CheckDuplicates(col, i) {
    let name = col.name.split("-")[0];
    this.DisplayHeaderError = false;
    this.DisplayColumnError = false;
    this.DisplayNameError = false;
    if (col.value != "") {
      if (name = "Column_Name") {
        var str = '';
        if (col.value) {
          str = col.value;
          str = str.toLowerCase();
        }
        let a = this.InventoryData.filter(e => e['Display_Name'].toLowerCase() == str);
        if (a.length > 1) {
          this.DisplayHeaderError = true;
        }
      }
      if (name = "Column_Display_Order") {
        let a = this.InventoryData.filter(e => e[name] == col.value)
        if (a.length > 1) {
          this.DisplayColumnError = true;
        }
      }
      if (name = "Header_Name") {
        var str = '';
        if (col.value) {
          str = col.value;
          str = str.toLowerCase();
        }
        let a = this.InventoryData.filter(e => e['Header_Name'].toLowerCase() == str)
        if (a.length > 1) {
          this.DisplayNameError = true;
        }
      }
    }
    return i;
  }

  CheckUnallowedHeaders(col, i) {
    this.DisplayUnallowedError = false;
    if (this.UnallowedList.some(e => e == col.value)) {
      this.DisplayUnallowedError = true;
    }
    return i;
  }

  CheckMandatoryHeaders(h) {
    let arr = [];
    this.InventoryData.forEach(e => {
      if (e.Display_Name == h.value) {
        arr.push(e.Display_Name);
      }
    })
    if (arr.length > 1) {
      return false;
    }
    let a = this.DisabledHeaderList.filter(e => e == h.value);
    if (a.length == 1) {
      return true;
    }
    return false;
  }

  GetFileData(event) {

    // let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.File = event.target.files[0];
      this.Filename = this.File.name;
      this.ConvertToBase64()
    }
    else {
      this.File = null;
      this.FileBase64 = null;
      this.Filename = "No File chosen"
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
    this.DisplayFileError = false;
    if (this.File != null) {
      let dataobj = { File: this.FileBase64, File_Name: this.Filename, Client_Id: this.ClientId };
      this.service.InventoryUpload(dataobj).subscribe(
        res => {
          this.ResponseHelper.GetSuccessResponse(res)
          this.InventoryData = [];
          this.LoadingMsg = "Uploaded! Please come back after some time"
          this.File = null
          this.Filename = "No File Chosen";
          this.FileBase64 = null;
          this.ClientData.Is_Inventory_Uploaded = true;

          if (this.InventoryData.some(x => x.Is_Dropdown_Field == "Yes")) {
            this.ClientData.Is_Dropdown_Required = true;
          }
          if (this.InventoryData.some(x => x.Is_Formula_Computable == "Yes")) {
            this.ClientData.Is_Formula_Required = true;
          }

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

  DownloadTemplate() {
    this.downloadDisable = true
    this.service.DownloadTemplate().subscribe(
      (res: any) => {
        var url = window.URL.createObjectURL(res.data);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = res.filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        this.downloadDisable = false
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err)
        this.downloadDisable = false
      }
    );
  }

  submitFrom(val) {

    if (val.valid && this.InventoryData != null) {
      // console.log('disabled');
      this.DisableNext = true;

      let dataobj = { Client_Id: this.ClientId, Inventory_List: this.InventoryData }
      this.service.InsertOrUpdateInventory(dataobj).pipe(finalize(() => {
        // this.DisableNext = false;
        // console.log('enabled');
      })).subscribe(
        res => {

          this.ResponseHelper.GetSuccessResponse(res)
          this.ClientData.Is_Inventory_Uploaded = true;
          if (this.InventoryData.some(x => x.Is_Dropdown_Field == "Yes")) {
            this.ClientData.Is_Dropdown_Required = true;
          }
          if (this.InventoryData.some(x => x.Is_Formula_Computable == "Yes")) {
            this.ClientData.Is_Formula_Required = true;
          }
          this.GetAllInventory();
        },
        err => {
          this.DisableNext = false;
          this.ResponseHelper.GetFaliureResponse(err)
        }
      );
    }
  }

  NextPage() {
    this.next_page.emit('inventory');
  }

  ToggleModal() {
    if (this.DisplayModal) {
      this.DisplayModal = false
    }
    else this.DisplayModal = true;
  }

  AddInventoryRow(val) {

    val.Client_Id = this.ClientId;
    this.InventoryData.push(val);
    this.DisplayModal = false;
  }
}

export class InventoryModel {
  constructor() {
    this.Is_New = false;
  }
  Is_Standard_Changed = false;
  Is_Formula_Changed = false;
  Is_New: boolean;
  Header_Name: string;
  Display_Name: string;
  Column_Datatype: string;
  Field_Limit: string;
  Is_Dropdown_Field: string;
  Is_Edit_Allowed_Agent;
  Is_View_Allowed_Agent;
  Column_Display_Order: number;
  Is_Unique_Field;
  Is_Standard_Field;
  Is_Formula_Computable;
  Is_Client_Column;
  Is_Appeal;
  Is_Correspondence;
}
