import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router"
import { CommonService } from 'src/app/service/common-service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { Token } from 'src/app/manager/token';
import { ViewFileService } from 'src/app/service/view-file.service';


@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.css']
})
export class ViewDocumentComponent implements OnInit {
  title="View Document Page"
  constructor(private route: ActivatedRoute
    , private service: ViewFileService, private router: Router, private commonservice: CommonService, private notificationservice: NotificationService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('params : ', params);
    });
  }

}
