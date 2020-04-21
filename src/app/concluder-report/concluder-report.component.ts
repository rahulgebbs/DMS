import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-concluder-report',
  templateUrl: './concluder-report.component.html',
  styleUrls: ['./concluder-report.component.scss']
})
export class ConcluderReportComponent implements OnInit {
  title="Concluder Report";
  fromDate = new Date();
  maxDate = new Date();
  gridApi;
  gridColumnApi;
  rowData;
  columnDefs = [
    { headerName: 'ID', field: 'Id', hide: "false" },
    { headerName: 'Employee Code', field: 'Employee_Code' },
    { headerName: 'User Name', field: 'Username' },
    { headerName: 'Full Name', field: 'Full_Name' },
    { headerName: 'Email Id', field: 'Email_Id' },
    { headerName: 'Process', field: 'CommaSeparatedClients' }
  ];
  rowSelection = "single";
  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.rowData = [];
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.columnApi.autoSizeColumns();
  }
  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }
  onCellClicked(e) {}
}
