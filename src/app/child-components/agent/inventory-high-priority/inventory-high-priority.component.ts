import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { InventoryService } from 'src/app/service/client-configuration/inventory.service';
import { GridOptions } from "ag-grid-community";
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import * as moment from 'moment';
@Component({
  selector: 'app-inventory-high-priority',
  templateUrl: './inventory-high-priority.component.html',
  styleUrls: ['./inventory-high-priority.component.scss']
})
export class InventoryHighPriorityComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Output() allFields = new EventEmitter();
  @Input() old_Inventory_Log_Id;
  ResponseHelper: ResponseHelper;
  fieldSetting = {
    singleSelection: true,
    idField: 'Id',
    textField: 'Field_Name',
    closeDropDownOnSelection: true,
    allowSearchFilter: true
  }
  fieldList = [];
  reference = null;
  activeField = null;
  searchStatus = true;
  inventoryList = [];
  maxDate = new Date();
  columnDefs = [
    { headerName: 'Patient Name', field: 'Patient_Name', },
    { headerName: 'Dollar Value', field: 'Dollar_Value' },
    { headerName: 'Bucket Name', field: 'Bucket_Name' },
    { headerName: 'Voice NonVoice', field: 'Voice_NonVoice' },
    { headerName: 'Allocated To', field: 'Allocated_To' },
    { headerName: 'Account Number', field: 'Account_Number' },

  ];
  gridOptions: any = {

    context: {
      componentParent: this
    },
    rowClassRules: {
      // row style function
      'disable-row': function (params) {
        // var numSickDays = params.data.sickDays;
        // console.log('disable-row : ', params.data)
        return params.data.Completion_Date != null;
        // return true;
      }
    }
  };
  constructor(
    private inventoryService: InventoryService,
    private notification: NotificationService,

  ) { }

  ngOnInit() {
    this.getDropdownList();
    this.ResponseHelper = new ResponseHelper(this.notification);
    console.log('this.gridOptions : ', this.gridOptions.api);
    // this.initRow();
  }

  initRow() {

    // setTimeout(() => {
    //   console.log('After this.gridOptions : ', this.gridOptions);
    // this.gridOptions.api.forEachNode(rowNode => {
    //   console.log('rowNode : ', rowNode);
    //   if (rowNode.data.Bucket_Name == null) {
    //     // rowNode.setDataValue('currency', rowNode.data.value + Number(Math.random().toFixed(2)))
    //   }
    // });
    // }, 1000);
  }

  getDropdownList() {
    console.log('getDropdownList() : ');
    this.inventoryService.getInventoryDropdownList().subscribe((response) => {
      console.log('getInventoryDropdownList response : ', response);
      this.fieldList = response.Data;
      this.fieldList.forEach((ele, index) => {
        if (ele.Field_Name == "Unique_Key") {
          this.fieldList.splice(index, 1)
        }
      })
    }, (error) => {
      this.fieldList = [];
      console.log('error : ', error)
    })
    console.log('this.fieldList : ', this.fieldList);
  }

  searchInventoryList() {

    this.gridOptions.api.showLoadingOverlay();
    if (this.activeField && this.activeField.length > 0 && this.activeField[0].Type == 'date') {
      this.reference = moment(this.reference).format('MM-DD-YYYY');
    }
    console.log('searchInventoryList this.reference : ', this.reference);
    this.inventoryService.searchInventory(this.activeField[0].Field_Name, this.reference,this.old_Inventory_Log_Id).subscribe((response: any) => {
      this.inventoryList = response.Data ? response.Data.Special_Queue_Bucket_Inventory_Info : [];
      // this.inventoryList.forEach((element) => {
      //   element.Bucket_Name = "Special_Queue";
      // });
      this.inventoryList = JSON.parse(JSON.stringify(this.inventoryList));
      console.log('searchInventory response : ', response);
      sessionStorage.setItem('Accounts', JSON.stringify(this.inventoryList));
      this.ResponseHelper.GetSuccessResponse(response)
    }, (error) => {
      console.log('response : ', error);
      this.inventoryList = [];
      this.ResponseHelper.GetFaliureResponse(error)
    });
  }

  enableSearch() {
    console.log('enableSearch() : ', this.activeField, this.reference);
    if (this.activeField != null && this.activeField.length > 0) {
      const selectedObj = this.fieldList.find((ele) => {
        return ele.Id == this.activeField[0].Id;
      });
      console.log('selectedObj : ', selectedObj);
      this.reference = null;
      switch (selectedObj.Type) {
        case 'text': {
          this.reference = '';
          break;
        }
        case 'date': {
          this.reference = new Date();
          break;
        }
        default: {
          this.reference = '';
          break;
        }
      }
      if (this.activeField[0].Type != selectedObj.Type) {
        this.activeField[0].Type = selectedObj.Type; //[JSON.parse(JSON.stringify(type))];
      }
    }
    else {
      return null;
    }
    const status = this.activeField == null || this.activeField.length == 0 || this.reference == null || this.reference.length == 0 ? true : false;
    console.log('searchStatus : ', this.searchStatus);
    if (status != this.searchStatus) {
      this.searchStatus = status;
    }
  }

  closeModel() {
    console.log('closeModel() : ');
    this.close.emit(false);
  }
  rowClick(row) {
    console.log('rowClick row : ', row);
    // this.close.emit(row.data);
    const InventoryLogId = row.data && row.data.Inventory_Log_Id ? row.data.Inventory_Log_Id : 0;
    const { Inventory_Id, Bucket_Name, Inventory_Log_Id } = row.data;
    console.log('clientId, inventoryid, inventoryLogId, bucket_name : ', Inventory_Id, Bucket_Name, Inventory_Log_Id);

    // this.close.emit(row.data);
    this.inventoryService.gethighPriorityFields(Inventory_Id, InventoryLogId, this.old_Inventory_Log_Id,Bucket_Name).subscribe((resposne) => {
      console.log('gethighPriorityFields response : ', resposne);
      // inventory_Log_Id
      row.data.Inventory_Log_Id = resposne.Data.inventory_Log_Id;
      setTimeout(() => {
        sessionStorage.setItem('highPriporityAccount', 'true');
        this.allFields.emit(row.data);
      }, 100);
    }, (error) => {
      console.log('gethighPriorityFields error : ', error);
      sessionStorage.removeItem('highPriporityAccount')
    })
  }

  BlockInput(event) {
    if (event.key == 'Backspace' || event.key == 'Tab') {
      return true;
    }
    else {
      return false;
    }
  }
  chosenMonthHandler(date, datepicker) {
    console.log('chosenMonthHandler : ', this.reference, date);
    this.reference = new Date(date);
  }
}
