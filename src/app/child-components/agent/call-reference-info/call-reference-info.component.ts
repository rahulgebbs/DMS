import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';


@Component({
  selector: 'app-call-reference-info',
  templateUrl: './call-reference-info.component.html',
  styleUrls: ['./call-reference-info.component.scss']
})
export class CallReferenceInfoComponent implements OnInit,OnChanges {
  @Output() close = new EventEmitter()
  @Input() CallReference_No;
  constructor() { }
  firstName = "<<First Name>>";
  providerName = "<<Provider Name>>";
  taxID = "<<Tax ID>>";
  contactNumber = "<<Contact Number>>";
  extension = "<<Extension>>";
  referenceNumber = "<<Reference Number>>"
  ngOnInit() {
    // this.referenceNumber = this.CallReference_No ? `<<${this.CallReference_No}>>` : "<<No Call Reference Number>>"
  }

  ngOnChanges()
  {
    this.referenceNumber = this.CallReference_No ? `<<${this.CallReference_No}>>` : "<<No Call Reference Number>>"
  }

  closeModal() {
    console.log('closeModal() : ');
    try {
      this.close.emit();
    } catch (error) {
      console.log('try catch : ', error)
    }
  }
}
