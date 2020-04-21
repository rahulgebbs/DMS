
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import * as moment from 'moment';


@Component({
  selector: 'app-mystats',
  templateUrl: './mystats.component.html',
  styleUrls: ['./mystats.component.css']
})
export class MystatsComponent implements OnInit {
  @Output() Toggle = new EventEmitter<any>();
  @Input() MyStat;
  @Input() statCalucualted;
  gridApi;
  gridColumnApi;
  rowSelection = "single";
  toCall: number = 0;
  done: number = 0;
  date: any[] = []
  newStat: any[] = [];
  columnDefs = [
    { headerName: 'Date', field: 'date', },
    { headerName: 'To Call', field: 'countToCall' },
    { headerName: 'Done', field: 'countDone' },
  ];
  constructor() { }

  ngOnInit() {
    this.Stats()
  }

  datecheck(params) {

    let val
    val=moment(params).format('MM/DD/YYYY');
   return val
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit()
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  closeModel() {
    this.Toggle.emit(this.statCalucualted);
  }
  Stats() {
    this.newStat = new Array<any>()
    if (this.MyStat && !this.statCalucualted) {
      this.MyStat.filter(obj => {
          obj.date = moment(obj.Date).format('MM/DD/YYYY')
          if (obj.Account_Status == "Done") {
            obj.countDone = 1
            obj.countToCall = 0
          } else if (obj.Account_Status == "To Call") {
            obj.countDone = 0
            obj.countToCall = 1
          } else {
            obj.countDone = 0;
            obj.countToCall = 0;
          }
          obj.check = false
      })
      var mystat2 = this.MyStat
      for (let i = 0; i < this.MyStat.length; i++) {
        if (!this.MyStat[i].check) {
          for (var j = i + 1; j < mystat2.length; j++ ) {
            if (this.MyStat[i].date == mystat2[j].date ){
              if (this.MyStat[i].countDone != null && this.MyStat[i].countDone != undefined) {
                this.MyStat[i].countDone = this.MyStat[i].countDone + this.MyStat[j].countDone;
              }
              if (this.MyStat[i].countToCall != null && this.MyStat[i].countToCall != undefined) {
                this.MyStat[i].countToCall = this.MyStat[i].countToCall + this.MyStat[j].countToCall
              }
              this.MyStat[j].check = true
              this.MyStat.splice(j, 1, [0])
          this.statCalucualted = true
            }


          }
        }
        if (this.MyStat[i].date) {
          if(this.MyStat[i].countDone !=0 || this.MyStat[i].countToCall !=0){
          this.newStat[i] = this.MyStat[i]
          }
        }
      }
    } else {
      if(this.MyStat){
      for(let i =0;i<this.MyStat.length;i++){
        if(this.MyStat[i][0] !=0 ){
          if(this.MyStat[i].countDone !=0 || this.MyStat[i].countToCall !=0){
            this.newStat[i]=this.MyStat[i]
          }
          
        }
      }
    }
    else{
      this.newStat=[]
    }
    }
  }
}
