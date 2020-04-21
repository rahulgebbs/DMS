import { Component, OnInit, Output,EventEmitter} from '@angular/core';

@Component({
  selector: 'app-account-list-modal',
  templateUrl: './account-list-modal.component.html',
  styleUrls: ['./account-list-modal.component.css']
})
export class AccountListModalComponent implements OnInit {
  @Output() CloseAccountModal = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  Close() {
    this.CloseAccountModal.emit(false);
  }
}
