import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-multiple-tab',
  templateUrl: './multiple-tab.component.html',
  styleUrls: ['./multiple-tab.component.css']
})

export class MultipleTabComponent implements OnInit {
  title = "Multiple Tab Mode"
  @HostListener('window:beforeunload', ['$event'])
  onWindowClose(event: any): void {
    localStorage.tabCount = localStorage.tabCount - 1;
  }
  constructor() {

  }

  ngOnInit() {
  }


}
