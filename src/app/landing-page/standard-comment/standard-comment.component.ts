import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common-service';
import { Token } from 'src/app/manager/token';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StandardCommentService } from './../../service/standard-comment.service';
import { dropDownFields } from 'src/app/manager/dropdown-feilds';

@Component({
  selector: 'app-standard-comment',
  templateUrl: './standard-comment.component.html',
  styleUrls: ['./standard-comment.component.css'],
  providers: [dropDownFields]
})
export class StandardCommentComponent implements OnInit {

  title = 'Standard Comment';
  UserId: number;
  ResponseHelper: ResponseHelper;
  ClientList: any[];
  ClientId: number;
  AddStandardComment: FormGroup;
  validated: boolean = false;
  submitBtnDisable: boolean = false;
  SelectedStandardComment: any;
  SelectedId: number;
  gridApi;
  gridColumnApi;
  rowData: any = [];
  RowSelection = "single";
  SelectedClientId: number;
  StandardComment: StandardCommentInfo = new StandardCommentInfo();
  userdata;

  columnDefs = [
    { headerName: "Client Name", field: "Client_Name", width: 250 },
    { headerName: "Comments", field: "Comment", width: 300 },
    { field: "Client_Id", hide: true }
  ]

  constructor(private selectedFields: dropDownFields, private service: StandardCommentService, private fb: FormBuilder, private commonservice: CommonService, private router: Router, private notificationservice: NotificationService) {
    var token = new Token(this.router);
    this.userdata = token.GetUserData();
    this.UserId = this.userdata.UserId;
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }

  ngOnInit() {
    this.ClientList = this.selectedFields.setSelected(this.userdata.Clients);
    if (this.ClientList[0].selected) {
      this.ClientId = this.ClientList[0].Client_Id;
    }
    this.CreateStandardCommentForm();
  }

  CreateStandardCommentForm() {
    this.AddStandardComment = this.fb.group({
      'Client_Id': ['', Validators.required],
      'Comment': ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
      'Id': [''],
    })
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
  }



  OnRowClicked(event) {
    this.SelectedId = event.data.Id;
    this.AddStandardComment.patchValue({ 'Id': this.SelectedId })
    this.GetSelectedStandardComment();
  }

  ClientOnChange(event) {
    this.SelectedClientId = event.target.value;
    this.GetDenialCodeList(this.SelectedClientId);
    this.StandardComment.Comment = ''
  }


  GetDenialCodeList(clientId: number) {
    this.service.GetAllStandardComment(clientId).subscribe(data => {
      let res = data.json()
      this.rowData = res.Data
    }, err => {
      this.rowData = [];
      this.ResponseHelper.GetFaliureResponse(err)
    });
  }



  GetSelectedStandardComment() {
    this.service.GetSelectedStandardComment(this.SelectedClientId, this.SelectedId).subscribe(
      res => {
        this.StandardComment = res.json().Data;
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );

  }

  SubmitForm() {
    this.validated = true;
    if (this.AddStandardComment.valid) {
      this.validated = false;
      this.submitBtnDisable = true;

      if (this.AddStandardComment.value.Id) {

        this.service.UpdateStandardComment(this.AddStandardComment.value).pipe(finalize(() => {
        })).subscribe(
          res => {
            this.ResponseHelper.GetSuccessResponse(res);
            this.submitBtnDisable = false;
            this.GetDenialCodeList(this.SelectedClientId);
            this.clearForm();
          },
          err => {
            this.ResponseHelper.GetFaliureResponse(err);
            this.submitBtnDisable = false
          }
        );
      }
      else {

        this.service.AddStandardComment(this.AddStandardComment.value).subscribe(data => {

          this.ResponseHelper.GetSuccessResponse(data);
          this.submitBtnDisable = false;
          this.GetDenialCodeList(this.SelectedClientId);
          this.clearForm();

        }, err => {

          this.submitBtnDisable = false;
          this.ResponseHelper.GetFaliureResponse(err);
        });
      }

    }
    else {
      this.validated = true;
    }

  }


  clearForm() {
    this.validated = false;
    this.AddStandardComment.reset();
  }
}


export class StandardCommentInfo {
  Id?: number;
  Client_Id?: number;
  Comment?: string;

}