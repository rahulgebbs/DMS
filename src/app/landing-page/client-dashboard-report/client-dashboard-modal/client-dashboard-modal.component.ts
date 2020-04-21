import { Component, OnInit,Output,EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-client-dashboard-modal',
  templateUrl: './client-dashboard-modal.component.html',
  styleUrls: ['./client-dashboard-modal.component.css']
})
export class ClientDashboardModalComponent implements OnInit {

  rowData
  columnDefs
  RowSelection = "single";
  gridApi;
  ResponseHelper;
  gridColumnApi;
  ColumnDefs;
  @Input() countdata
  @Output() Toggle = new EventEmitter<any>();

  constructor() { 

    this.ColumnDefs = [
      {headerName: "Username", field: "Username"},
      { headerName: "Created_Role_Name", field: "Created_Role_Name"},
      { headerName: "Count", field: "Count"},
     ];
  }

  ngOnInit() {
    
  this.rowData=this.countdata
  }
  
toggleModel(){

  this.Toggle.emit('')
}

onGridReady(params) {
   this.gridApi = params.api;
   this.gridColumnApi = params.columnApi;
   params.columnApi.autoSizeColumns()
 }
}
