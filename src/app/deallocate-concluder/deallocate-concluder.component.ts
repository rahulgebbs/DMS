import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-deallocate-concluder',
  templateUrl: './deallocate-concluder.component.html',
  styleUrls: ['./deallocate-concluder.component.css']
})
export class DeallocateConcluderComponent implements OnInit {
  title = "De-Allocate Concluder";
  fromDate = new Date();
  maxDate = new Date();
  gridApi;
  gridColumnApi;
  rowData;
  columnDefs = [
    {
      headerName: '#', width: 130, checkboxSelection: true, suppressSorting: true,
      suppressMenu: true, pinned: true
    },
    { headerName: 'ID', field: 'Id', hide: "false" },
    { headerName: 'Employee', field: 'Employee' },
    { headerName: 'Non Concluder Accounts', field: 'Count' }
  ];
  rowSelection = "single";
  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.rowData = [{
      Employee: 121,
      Count: 6
    }, {
      Employee: 122,
      Count: 5
    }, {
      Employee: 123,
      Count: 1
    }];
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
  onCellClicked(e) { }

}
