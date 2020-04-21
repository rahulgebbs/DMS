import { Component, OnInit, EventEmitter, Output,Input } from '@angular/core';

@Component({
  selector: 'app-i-notepad',
  templateUrl: './i-notepad.component.html',
  styleUrls: ['./i-notepad.component.css']
})
export class INotepadComponent implements OnInit {
  @Output() Toggle = new EventEmitter<any>();
  @Input() notevalue;
  preVal
  constructor() { }

  ngOnInit() {
  }
  closeModel() {
        
    this.Toggle.emit(this.notevalue);
  }
  clear() {
    this.notevalue = ''
  }


}
