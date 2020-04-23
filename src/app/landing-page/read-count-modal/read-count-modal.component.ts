import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ExcelService } from 'src/app/service/client-configuration/excel.service';
import { UploadFileService } from 'src/app/service/upload-file.service';

@Component({
  selector: 'app-read-count-modal',
  templateUrl: './read-count-modal.component.html',
  styleUrls: ['./read-count-modal.component.css']
})
export class ReadCountModalComponent implements OnInit {
  @Input() document;
  @Output() Toggle = new EventEmitter<any>();
  rowData;
  gridApi;
  ResponseHelper;
  gridColumnApi;
  rowSelection = "single";
  columnDefs = [
    { headerName: 'Name', field: 'Name', width: 250 },
    { headerName: 'Status', field: 'Status', width: 120 },
    { headerName: 'Date', field: 'Read_By_Agent_On' }
  ]
  private excelService = new ExcelService
  constructor(private uploadFileService: UploadFileService) { }

  ngOnInit() {
    this.rowData = null;
    this.uploadFileService.getreadCount(this.document.Id).subscribe((response: any) => {
      console.log('response : ', response);
      this.rowData = response.Data;
    }, (error) => {
      console.log('error : ', error);
      this.rowData = [];
    })
  }
  getDocumentCOunt() {
    // this.
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
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

}
