import { Component, OnInit, Output, EventEmitter, Input  } from '@angular/core';

@Component({
  selector: 'app-production-employee-selector-modal',
  templateUrl: './production-employee-selector-modal.component.html',
  styleUrls: ['./production-employee-selector-modal.component.css']
})
export class ProductionEmployeeSelectorModalComponent implements OnInit {

  @Input() AllEmployees;
  SelectAll = false;
  @Output() CloseModal = new EventEmitter<any>();
  @Output() SendSelectedEmp = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
    this.CheckSelectAll()
  }

  Close() {
    this.CloseModal.emit(false);
  }

  SelectAllToggle(event) {
    if (event.currentTarget.checked) {
      this.AllEmployees.forEach(e => {
        e.Is_Selected = true;
      });
    }
    else {
      this.AllEmployees.forEach(e => {
        e.Is_Selected = false;
      });
    }
  }

  SendSelectedEmployees() {
    this.SendSelectedEmp.emit(this.SendSelected());
  }

  CheckSelectAll() {
    if (this.AllEmployees.every(v => v.Is_Selected == true)) {
      this.SelectAll = true;
    }
    else {
      this.SelectAll = false;
    }
  }

  checkSelect(Id) {
    this.AllEmployees[Id].Is_Selected = !this.AllEmployees[Id].Is_Selected;
    if (this.AllEmployees.every(v => v.Is_Selected == true)) {
      this.SelectAll = true;
    }
    else {
      this.SelectAll = false;
    }
  }

  SendSelected() {
    let dataobj = [];
    this.AllEmployees.forEach(e => {
      if (e.Is_Selected) {
        e.Is_Old = true;
        dataobj.push(e);
      } else {
        e.Is_Old = false;
        e.Is_Selected = false
      }
    });
    return dataobj;
  }

}
