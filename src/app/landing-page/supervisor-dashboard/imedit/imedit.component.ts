import { Component, OnInit,Output,EventEmitter, Input } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import * as moment from 'moment'


@Component({
  selector: 'app-imedit',
  templateUrl: './imedit.component.html',
  styleUrls: ['./imedit.component.css']
})
export class ImeditComponent implements OnInit {

  ShowModal=true
  IM_edits_data
  ResponseHelper: ResponseHelper;
  // ClientdataId
@Input() IMdata
 @Input() IMdates
 rowData
 gridApi
 gridColumnApi
 rowSelection = 'single'


 columnDefs = [
  { headerName: 'Insurance Name', field: 'Insurance_Name' },
  { headerName: 'Created Date', field: 'Created_Date',cellRenderer: this.ValCheck }
];
 
  @Output() Toggle = new EventEmitter<any>();
  constructor(private dash: DashboardService) { }

  ngOnInit() {
    
   this.rowData=this.IMdata
    
  }
  

  ValCheck(params) {

    let val
    val=moment(params).format('MM/DD/YYYY');
   return val
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.columnApi.autoSizeColumns();
    params.api.sizeColumnsToFit()
  }


  dismissModel(){
    this.ShowModal = false;
    this.Toggle.emit(this.ShowModal);
  }
}
