import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ExcelService } from 'src/app/service/client-configuration/excel.service';

@Component({
  selector: 'app-count-model',
  templateUrl: './count-model.component.html',
  styleUrls: ['./count-model.component.css']
})
export class CountModelComponent implements OnInit {
  @Input() readCountData;
  @Output() Toggle = new EventEmitter<any>();
  rowData;
  gridApi;
  ResponseHelper;
  gridColumnApi;
  rowSelection = "single";
  columnDefs = [
    { headerName: 'Name', field: 'Name', width:250 },
    { headerName: 'Status', field: 'Status', width:120 },



  ]
  private excelService= new ExcelService
  constructor() { }

  ngOnInit() {
      
    this.rowData = this.readCountData.Data
  }
  toggleModel() {

    this.Toggle.emit('');

  }
  onGridReady(params) {
   // params.api.sizeColumnsToFit()
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    //this.autoSizeAll();
  }

  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }
  

  ExportToExcel() {
    var exportData = [];
    this.rowData.forEach((el) => {
      var obj = new Object()
      obj['Name'] = el.Name;
      obj['Status']=el.Status;
      
      exportData.push(obj);  
    })
    this.excelService.exportAsExcelFile(exportData, 'Clien_INstruction_Data');
  }
}
