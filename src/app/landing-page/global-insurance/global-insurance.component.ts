import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalInsuranceService } from 'src/app/service/global-insurance.service';
import { Token } from 'src/app/manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';

@Component({
  selector: 'app-global-insurance',
  templateUrl: './global-insurance.component.html',
  styleUrls: ['./global-insurance.component.css'],
  providers: [GlobalInsuranceService]
})
export class GlobalInsuranceComponent implements OnInit {
  title = "Global Insurance Master";
  UserId;
  gridApi;
  gridColumnApi;
  SelectedInsurance;
  SelectedInsuranceId;
  rowData;
  RowSelection = "single";
  columnDefs = [];
  ShowModal = false;
  ResponseHelper
  constructor(private router: Router, private service: GlobalInsuranceService, private notificationservice: NotificationService) { }

  ngOnInit() {
    var token = new Token(this.router);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    this.GetGlobalMasters();
  }

  GetGlobalMasters() {
    this.service.GetMasterList().subscribe(
      data => {
        // this.ResponseHelper.GetSuccessResponse(data, data.json())

        this.rowData = data.json().Data;
        var arr: {} = data.json().Data[0];
        this.columnDefs = [];
        var headers = Object.keys(arr)
        headers.forEach(e => {
          switch (e) {
            case "Id":
              this.columnDefs.push({ field: e, hide: true, rowGroupIndex: null })
              break;
            case "Created_By":
              this.columnDefs.push({ field: e, hide: true, rowGroupIndex: null })
              break;
            case "Created_Date":
              this.columnDefs.push({ field: e, hide: true, rowGroupIndex: null })
              break;
            case "Updated_By":
              this.columnDefs.push({ field: e, hide: true, rowGroupIndex: null })
              break;
            case "Updated_Date":
              this.columnDefs.push({ field: e, hide: true, rowGroupIndex: null })
              break;

            default:
              let h = e.split("_").join(" ");
              this.columnDefs.push({
                headerName: h, field: e
              })
              break;
          }
        })

      },
      err => {
        this.rowData = [];
        this.ResponseHelper.GetFaliureResponse(err)
      }
    )
  }

  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  OnRowClicked(event) {
    this.SelectedInsuranceId = event.data.Id;
    this.GetSelectedInsurance();
  }

  GetSelectedInsurance() {
    this.service.GetGlobalInsurance(this.SelectedInsuranceId).subscribe(
      res => {
        this.SelectedInsurance = res.json().Data;
        this.ShowModal = true;
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  CloseModal(){
    this.ShowModal = false;
  }

  UpdateMasterList(){
    this.GetGlobalMasters();
  }
}
