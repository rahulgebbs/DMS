import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit {

  @Input() InputUrl;
  @Output() ClosePopup = new EventEmitter<any>();

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  DisableRightClick(e) {
    e.preventDefault();
    return false;
  }

  Close() {
    this.ClosePopup.emit()
  }

}
