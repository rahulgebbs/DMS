import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ColumnGroup } from 'ag-grid-community';
import { parseIntAutoRadix } from '@angular/common/src/i18n/format_number';

@Component({
  selector: 'app-citra-accounts-modal',
  templateUrl: './citra-accounts-modal.component.html',
  styleUrls: ['./citra-accounts-modal.component.css']
})
export class CitraAccountsModalComponent implements OnInit {
  @Output() CloseAccountModal = new EventEmitter<any>();
  @Output() GetAllFields = new EventEmitter<any>();
  @Input() CitraAccountsList;
  @Input() WorkingAccountId: number;
  RowSelection = "single";
  PayerName = '';
  columnDefs = [];
  GridApi;
  CreateTemplate = '<b>hhhh</b>'
  constructor() { }

  ngOnInit() {

    console.log('verify the data on child');
    console.log(this.CitraAccountsList);

    this.columnDefs = [
      { field: 'id', rowGroupIndex: null, hide: true },
      { field: 'Inventory_ID', rowGroupIndex: null, hide: true },
      { field: 'Inventory_Log_Id', rowGroupIndex: null, hide: true },
      { headerName: 'Account Number', field: 'Account_Number' },
      { headerName: 'Claim Amount', field: 'Claim_Amount' },
      { headerName: 'Date of Service', field: 'DOS' },
      { headerName: 'Patient Name', field: 'Patient_Name' },
      { headerName: 'Insurance Name', field: 'Payor' },
      { headerName: 'Practice', field: 'Practice' }
    ]
  }

  OnCellClicked(e) {
    if (e.event.target.localName == 'button') {
      this.GetFieldsFromAccount(e.data.Bucket_Name, e.data.Id , e.data.Inventory_ID, e.data.Inventory_Log_Id);
    }
  }

  OnRowClicked(e) {
    this.GetFieldsFromAccount(e.data.Bucket_Name, e.data.Id,e.data.Inventory_ID, e.data.Inventory_Log_Id);
  }

  GetFieldsFromAccount(bucketname, RecordId, inventoryid, inventory_Log_Id) {
    if (this.WorkingAccountId != inventoryid) {
      this.WorkingAccountId = inventoryid;
      this.GetAllFields.emit({ Bucket_Name: bucketname,Id : RecordId, Inventory_Id: inventoryid, Inventory_Log_Id: inventory_Log_Id });
    }
    else {
      this.CloseAccountModal.emit(false);
    }
  }

  Close() {
    this.CloseAccountModal.emit(false);
  }

  OnGridReady(event) {

    if (this.CitraAccountsList != null) {
      var allColumnIds = [];
      event.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
      });
      event.columnApi.autoSizeColumns(allColumnIds);

      var thisref = this;
      event.api.forEachNode(function (node) {
        if (node.data.Inventory_Id == thisref.WorkingAccountId) {
          node.setSelected(true, true);
        }
      });
    }

  }

  ActionDisable(params) {
    if (params.value == params.colDef.field2) {

      var eDiv = document.createElement('div');
      eDiv.innerHTML = '<button disabled class="btn label blue label-info square-btn cursor">Start</button>'
      return eDiv;

    }
    else {

      var eDiv = document.createElement('div');
      eDiv.innerHTML = '<button  class="btn label blue label-info square-btn cursor">Start</button>'
      return eDiv;
    }
  }

}
