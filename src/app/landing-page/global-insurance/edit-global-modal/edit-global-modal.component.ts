import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GlobalInsuranceService } from 'src/app/service/global-insurance.service';
import { finalize } from 'rxjs/operators';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-edit-global-modal',
  templateUrl: './edit-global-modal.component.html',
  styleUrls: ['./edit-global-modal.component.css']
})
export class EditGlobalModalComponent implements OnInit {
  @Input() SelectedInsurance;
  @Output() CloseModal = new EventEmitter<any>();
  @Output() UpdateData = new EventEmitter<any>();
  DisableSubmit = false;
  ResponseHelper: ResponseHelper;
  constructor(private service: GlobalInsuranceService, private notification: NotificationService) { }

  ngOnInit() {
    this.ResponseHelper = new ResponseHelper(this.notification);
  }

  Close() {
    this.CloseModal.emit(false);
  }

  UpdateInsurance() {
    this.DisableSubmit = true;
    this.service.UpdateGlobalInsurance(this.SelectedInsurance).pipe(finalize(() => {
      this.DisableSubmit = false;
    })).subscribe(
      res => {
        this.ResponseHelper.GetSuccessResponse(res);
        this.CloseModal.emit(false);
        this.UpdateData.emit(true);

      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }

}
