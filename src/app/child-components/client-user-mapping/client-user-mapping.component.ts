import { Component, OnInit, Output, EventEmitter, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';
import { ClientUserMappingService } from 'src/app/service/client-user-mapping.service';

import { Router } from '@angular/router';
import { Token } from 'src/app/manager/token';

@Component({
  selector: 'app-client-user-mapping',
  templateUrl: './client-user-mapping.component.html',
  styleUrls: ['./client-user-mapping.component.css']
})
export class ClientUserMappingComponent implements OnInit, OnChanges {
  @Input() modalStatus: boolean;
  @Output() hideModal = new EventEmitter();
  rowData = [];
  columnDefs = [];
  userData;
  token;
  constructor(private clientUserMappingService: ClientUserMappingService, private router: Router, private cdr: ChangeDetectorRef) {
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();
  }

  ngOnInit() {
    console.log('ngOnInit() : ', this.modalStatus);
  }


  getList() {
    this.rowData = null;
    this.clientUserMappingService.getUserMappingInfo(this.userData.TokenValue).subscribe((response: any) => {
      // setTimeout(() => {
      console.log('response : ', response);
      if (response && response.Data) {
        this.rowData = response.Data;
      }
      else {
        this.rowData = [];
      }
      this.cdr.detectChanges();
      // }, 2000);
    }, (error) => {
      this.rowData = [];
      this.cdr.detectChanges();
      console.log('error : ', error)
    });
    /*
            "CitrixId": "CitrixId",
            "Software_Id": "Software_Id",
            "FOB_cerner": "FOB_cerner",
            "ClearingHouseName": "ClearingHouseName",
            "ClearingHouseId": "1"
    */
    this.columnDefs = [
      { headerName: 'Citrix Id', field: 'CitrixId' },
      { headerName: 'Software Id', field: 'Software_Id' },
      { headerName: 'FOB cerner', field: 'FOB_cerner' },
      { headerName: 'Clearing House Name', field: 'ClearingHouseName' },
      { headerName: 'Clearing House Id', field: 'ClearingHouseId' }
    ];
  }
  ngOnChanges(changes) {
    console.log('app-client-user-mapping changes : ', changes);
    this.getList();
  }
  close() {
    this.hideModal.emit(false);
  }

}
