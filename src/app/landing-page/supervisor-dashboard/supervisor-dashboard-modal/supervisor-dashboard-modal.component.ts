import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
@Component({
  selector: 'app-supervisor-dashboard-modal',
  templateUrl: './supervisor-dashboard-modal.component.html',
  styleUrls: ['./supervisor-dashboard-modal.component.css']
})
export class SupervisorDashboardModalComponent implements OnInit {
  ShowModal = true
  @Input() AllocatedCountsData
  rowData;
  gridApi;
  gridColumnApi
  rowSelection = 'single'
  @Output() Toggle = new EventEmitter<any>();


  columnDefs = [
    { headerName: 'Allocated to', field: 'Allocated_To' },
    { headerName: 'Allocated Count', field: 'Account_Count' }
  ];

  constructor() { }

  ngOnInit() {
      
    this.rowData = this.AllocatedCountsData
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.columnApi.autoSizeColumns();
    params.api.sizeColumnsToFit()
  }

  dismissModel() {
    this.ShowModal = false;
    this.Toggle.emit(this.ShowModal);
  }

}
