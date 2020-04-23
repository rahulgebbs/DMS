import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router"
import { CommonService } from 'src/app/service/common-service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { Token } from 'src/app/manager/token';
import { ViewFileService } from 'src/app/service/view-file.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.scss']
})
export class ViewDocumentComponent implements OnInit {
  title = "View Document Page"
  inputURL = 'file://172.30.52.25/c/Reference_Document/Akshay_Super_02.pdf';
  base64 = null;
  ResponseHelper;

  numberOfPages = 0;
  paramObj = null;
  userData = null;
  constructor(private route: ActivatedRoute
    , public sanitizer: DomSanitizer, private viewFileService: ViewFileService, private router: Router, private commonservice: CommonService, private notificationservice: NotificationService) { }

  ngOnInit() {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);

    this.route.params.subscribe(params => {
      console.log('params : ', params);
      this.paramObj = params;
      this.getFile();
    });
    this.userData = jwt_decode(sessionStorage.getItem('access_token'));
  }

  getFile() {
    let body = { "Display_File_Name": this.paramObj.filename, "Reference_File_Name": this.paramObj.referencefile };
    this.viewFileService.getFileURL(body).subscribe((response: any) => {
      console.log('response : ', response);
      // this.base64 = response._body;
      this.ConvertToBase64(response.data);
    }, (error) => {
      console.log('error : ', error)
    })
  }
  ConvertToBase64(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.base64 = reader.result.toString().split(',')[1];
      console.log('reader.onload : ', this.base64);
    }
  }

  scrollPage(event) {
    console.log('pageChange : ', this.userData, event);

    if (this.numberOfPages == event && this.userData.Role_Name == 'Agent') {
      // call API
      let body = { "Reference_Document_Id": this.paramObj.Id, "Agent_Id": this.userData.User_Id, "Client_Id": this.paramObj.Client_Id }
      this.viewFileService.updateViewCount(body).subscribe((response) => {
        console.log('updateViewCount : ', response);
        this.ResponseHelper.GetSuccessResponse(response);

      }, (error) => {
        console.log('updateViewCount : ', error);
        this.ResponseHelper.GetFaliureResponse(error);
      })
    }
  }
  pageCount(event) {
    console.log('pageCount($vent) : ', event);
    this.numberOfPages = event.pagesCount;
  }

  goBack() {
    window.history.back();

  }
}
