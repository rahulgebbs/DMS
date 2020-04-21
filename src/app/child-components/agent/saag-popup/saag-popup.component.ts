import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-saag-popup',
  templateUrl: './saag-popup.component.html',
  styleUrls: ['./saag-popup.component.css']
})
export class SaagPopupComponent implements OnInit {
  @Output() Toggle = new EventEmitter<any>();
  @Input() AgentSaag;
  gridApi;
  gridColumnApi;
  rowSelection = "single";
  columnDefs = [
    {
      headerName: 'Status', field: 'Status', tooltip: function (params) {
        return (params.value);
      }
    },
    {
      headerName: 'SubStatus', field: 'Sub_Status', tooltip: function (params) {
        return (params.value);
      }
    },
    {
      headerName: 'Action Code', field: 'Action_Code', tooltip: function (params) {
        return (params.value);
      }
    },
    {
      headerName: 'Effectiveness Matrix', field: 'Effectiveness_Matrix', tooltip: function (params) {
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
