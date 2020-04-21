import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { Token } from 'src/app/manager/token';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/service/client-configuration/client.service';

@Component({
  selector: 'app-delete-client-user-mapping-management',
  templateUrl: './delete-client-user-mapping-management.component.html',
  styleUrls: ['./delete-client-user-mapping-management.component.scss']
})
export class DeleteClientUserMappingManagementComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Input() user;
  ResponseHelper: ResponseHelper;
  token;
  userData;
  httpStatus = false;
  constructor(
    private clientService: ClientService,
    private router: Router,
    private notificationservice: NotificationService
  ) { }

  ngOnInit() {
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();
  }

  closeModal(status) {
    this.close.emit(status);

  }
  submit() {
    this.httpStatus = true;
    console.log('deleteUser : ', this.user, this.userData);
    this.clientService.deleteECNUser(this.userData, this.user, false).subscribe((response) => {
      console.log('response : ', response);
      this.httpStatus = false;
      this.close.emit(true);
      this.notificationservice.ChangeNotification(response.Message);
      

    }, (error) => {
      console.log('error : ', error);
      this.httpStatus = false;
      // this.ResponseHelper.GetFaliureResponse(error);
      this.ResponseHelper.GetFaliureResponse(error);
    })
  }
}
