import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { Token } from 'src/app/manager/token';
  import { from } from 'rxjs';
  import {BireportService} from 'src/app/service/bireport.service'
  import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-flashdashboard-report',
  templateUrl: './flashdashboard-report.component.html',
  styleUrls: ['./flashdashboard-report.component.css']
})
export class FlashdashboardReportComponent implements OnInit {

  Title = "Flash Dashboard";
  ResponseHelper: ResponseHelper;
  ClientId = 0;
  UserId = 0;
  Client_Name = '';
  LinkDetails=[];
Url="";
urlSafe: SafeResourceUrl;
  constructor(private router: Router, private notificationservice: NotificationService,private bi: BireportService,public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    var token = new Token(this.router);
    var userdata = token.GetUserData();
    console.log(userdata);
    this.UserId = userdata.UserId;
    this.ClientId = userdata.Clients[0].Client_Id;
    this.Client_Name = userdata.Clients[0].Client_Name;
    this.getClientBiReports();
  }

  getClientBiReports()
  {
    let  formbody ={"Client_Id":this.ClientId,"Client_Name":this.Client_Name};
    console.log(formbody);
    this.bi.GetBiReport(formbody).pipe().subscribe(
      (res) => {
        
        this.LinkDetails = res.json().Data;      
        for(var i=0;i<this.LinkDetails.length;i++)
        {
          if(this.LinkDetails[i].Report_Name=='Flash')
          {
            console.log('print Link')
            console.log(this.LinkDetails[i].BI_Link)
            this.Url=this.LinkDetails[i].BI_Link;
            this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.Url);
          }    
        }
          
      },
      (err) => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
    
  }

}
