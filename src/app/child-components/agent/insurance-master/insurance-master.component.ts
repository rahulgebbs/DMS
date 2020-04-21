import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-insurance-master',
  templateUrl: './insurance-master.component.html',
  styleUrls: ['./insurance-master.component.css']
})
export class InsuranceMasterComponent implements OnInit {

  @Output() CloseInsMaster = new EventEmitter<any>();
  @Input() SelectedGlobal;
  constructor() { }

  ngOnInit() {
  }

  Close() {
    this.CloseInsMaster.emit(false);
  }

}
