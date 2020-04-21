
import { Component, OnInit,EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-bcb-popup',
  templateUrl: './bcb-popup.component.html',
  styleUrls: ['./bcb-popup.component.css']
})
export class BcbPopupComponent implements OnInit {

  @Output() Toggle = new EventEmitter<any>();
  @Input() BCBAssistance;
  gridApi;
  gridColumnApi;
  rowSelection = "single";
  columnDefs = [
    {
      headerName: 'Prefix', field: 'Prefix', tooltip: function (params) {
        return (params.value);
      }
    },
    {
      headerName: 'Plan Name', field: 'Plan_Name', tooltip: function (params) {
        return (params.value);
      }
    },
    {
      headerName: 'Phone Number', field: 'Phone_Number', tooltip: function (params) {
        return (params.value);
      }
    }

  ]
  constructor() {

  }
  onGridReady(params) {
    params.api.sizeColumnsToFit()
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  ngOnInit() {
  }

  toggleModel() {
    this.Toggle.emit();
  }


}

