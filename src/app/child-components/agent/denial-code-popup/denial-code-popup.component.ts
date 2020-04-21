import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-denial-code-popup',
  templateUrl: './denial-code-popup.component.html',
  styleUrls: ['./denial-code-popup.component.css']
})
export class DenialCodePopupComponent implements OnInit {

  @Output() Toggle = new EventEmitter<any>();
  @Input() DenialCodes;
  gridApi;
  gridColumnApi;
  rowSelection = "single";
  columnDefs = [
    {
      headerName: 'Denial_Code', field: 'Denial_Code', tooltip: function (params) {
        return (params.value);
      }
    },
    {
      headerName: 'Denial_Description', field: 'Denial_Description', tooltip: function (params) {
        return (params.value);
      }
    },
    {
      headerName: 'AM_Comments', field: 'AM_Comments', tooltip: function (params) {
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
