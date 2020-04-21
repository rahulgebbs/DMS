import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @Output() Toggle = new EventEmitter<any>();
  @Input() DisplayMenu;
  CurrentYear;
  // DisplayMenu = false;
  constructor() { }

  ngOnInit() {
    this.CurrentYear = (new Date()).getFullYear();
  }

  ToggleMenu() {
    if (this.DisplayMenu) {
      // setInterval(() => {
      this.DisplayMenu = false;
      // }, 200);
    }
    else {
      this.DisplayMenu = true;
    }
    this.Toggle.emit(this.DisplayMenu);
  }

}
