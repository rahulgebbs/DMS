import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { InventoryService } from 'src/app/service/client-configuration/inventory.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import * as moment from 'moment';
@Component({
  selector: 'app-call-reference',
  templateUrl: './call-reference.component.html',
  styleUrls: ['./call-reference.component.scss']
})
export class CallReferenceComponent implements OnInit {
  @Input()Old_Inventory_Log_Id;
  @Output() close = new EventEmitter();
  @Output() allFields = new EventEmitter();
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

  ) {
    this.ResponseHelper = new ResponseHelper(this.notification);
  }

  searchInventoryList() {
    // if (this.activeField && this.activeField.length > 0 && this.activeField[0].Type == 'date') {
    //   this.reference = moment(this.reference).format('MM-DD-YYYY');
    // }
    this.gridOptions.api.showLoadingOverlay();
    console.log('searchInventoryList this.reference : ', this.reference);

    this.inventoryService.searchCallReferenceAccounts(this.reference,this.Old_Inventory_Log_Id).subscribe((response: any) => {
      this.inventoryList = response.Data ? response.Data.Inventory_Info : [];
      console.log('searchCallReferenceAccounts response.Data : ', response.Data);
      // this.inventoryList.forEach((element) => {
      //   element.Bucket_Name = "Special_Queue";
      // });
      sessionStorage.setItem('Accounts', JSON.stringify(this.inventoryList));
      this.ResponseHelper.GetSuccessResponse(response)
    }, (error) => {
      console.log('response : ', error);
      this.inventoryList = [];
      this.ResponseHelper.GetFaliureResponse(error)
    });
  }
  ngOnInit() {
  }
  closeModel() {
    console.log('closeModel() : ');
    this.close.emit(false);
  }
  rowClick(row) {
    console.log('rowClick row : ', row.data);
    localStorage.setItem('callReference', JSON.stringify(row.data));
    this.allFields.emit(row.data);
  }

  BlockInput(event) {
    if (event.key == 'Backspace' || event.key == 'Tab') {
      return true;
    }
    else {
      return false;
    }
  }
 
}

