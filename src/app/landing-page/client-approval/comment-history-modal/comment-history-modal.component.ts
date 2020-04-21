import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { ClientApprovalService } from 'src/app/service/client-approval.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-comment-history-modal',
  templateUrl: './comment-history-modal.component.html',
  styleUrls: ['./comment-history-modal.component.css']
})
export class CommentHistoryModalComponent implements OnInit {

  @Input() HistoryData;
  @Output() ClosePopup = new EventEmitter<any>();

  ResponseHelper: ResponseHelper;
  DisableDownload = false;

  constructor(private notification: NotificationService, private service: ClientApprovalService) { }

  ngOnInit() {
    this.ResponseHelper = new ResponseHelper(this.notification)

  }

  GetReferenceFile(filename) {
    this.DisableDownload = true;
    this.service.GetReferenceFile(filename).pipe(finalize(() => {
      this.DisableDownload = false;
    })).subscribe(
      (res: any) => {
        var url = window.URL.createObjectURL(res.data);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    )
  }

  Close() {
    this.ClosePopup.emit();
  }

}
