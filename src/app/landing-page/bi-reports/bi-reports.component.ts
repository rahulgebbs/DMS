import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BireportService } from 'src/app/service/bireport.service';
import { Token } from 'src/app/manager/token';
@Component({
  selector: 'app-bi-reports',
  templateUrl: './bi-reports.component.html',
  styleUrls: ['./bi-reports.component.scss']
})
export class BiReportsComponent implements OnInit {
  reportObj: any = {};
  ClientId;
  Client_Name;
  reportList = [];
  httpresponse=false;
  // activeReport=null;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private bireportService: BireportService
  ) { }

  ngOnInit() {
    this.initClient();
    this.route.params.subscribe(params => {
      console.log(params);
      if (params) {
        this.reportObj = JSON.parse(JSON.stringify(params));
        // this.reportObj.link = this.sanitizer.bypassSecurityTrustResourceUrl(params.link);
      }
      this.getBIReportMenu();
      console.log('this.reportObj : ', this.reportObj)
    });
  }

  initClient(){
    var token = new Token(this.router);
    var userdata = token.GetUserData();
    console.log(userdata);
    this.ClientId = userdata.Clients[0].Client_Id;
    this.Client_Name = userdata.Clients[0].Client_Name;
  }
  getBIReportMenu() {
    this.httpresponse = true;
    let formbody = { "Client_Id": this.ClientId, "Client_Name": this.Client_Name };
    console.log('formbody : ', formbody, this.Client_Name, this.ClientId);
    this.bireportService.GetBiReport(formbody).subscribe((response) => {
      const json = response.json();
      this.reportList = json.Data;
      this.setURL();
      this.httpresponse = false;
      console.log('response json : ', json);
    }, (error) => {
      console.log('error : ', error);
      this.httpresponse = false;
    });
  }

  setURL() {
      this.reportList.forEach((element) => {
        if (element.Report_Name == this.reportObj.reportType) {
          this.reportObj.link = this.sanitizer.bypassSecurityTrustResourceUrl(element.BI_Link);
          return false;
        }
      });
  }

}
