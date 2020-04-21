import { Component, Output, EventEmitter } from '@angular/core';
import { InventoryModel } from '../inventory.component';

@Component({
  selector: 'app-inventory-modal',
  templateUrl: './inventory-modal.component.html',
  styleUrls: ['./inventory-modal.component.css']
})
export class InventoryModalComponent {
  HeaderModel = new InventoryModel();
  @Output() Close = new EventEmitter<any>();
  @Output() AddRow = new EventEmitter<any>();

  constructor() { }

  CloseModal() {
    this.Close.emit(false);
  }

  AppealOnChange() {
    if (this.HeaderModel.Is_Standard_Field == "Yes" && this.HeaderModel.Is_Appeal == "Yes") {
      this.HeaderModel.Is_Standard_Field = "No"
    }
  }

  StandardFieldOnChange() {
    if (this.HeaderModel.Is_Standard_Field == "Yes" && this.HeaderModel.Is_Appeal == "Yes") {
      this.HeaderModel.Is_Appeal = "No"
    }

  }

  FormulaOnChange() {
    if (this.HeaderModel.Is_Formula_Computable == "Yes" && this.HeaderModel.Column_Datatype == "Formula") {
      this.HeaderModel.Column_Datatype = "Text"
    }
  }

  DropdownOnChange() {
    if (this.HeaderModel.Is_Dropdown_Field == "Yes" && this.HeaderModel.Column_Datatype == "Formula") {
      this.HeaderModel.Column_Datatype = "Text"
    }
  }

  DatatypeOnChange() {
    if (this.HeaderModel.Column_Datatype == "Formula") {
      this.HeaderModel.Is_Formula_Computable = "No";
      this.HeaderModel.Is_Dropdown_Field = "No";
    }
  }

  OnSubmit(data: InventoryModel) {
    
    data
    data.Is_Client_Column = false;
    data.Is_New = true;
    this.AddRow.emit(data);
  }

}
