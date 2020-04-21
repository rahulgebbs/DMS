import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { Router } from '@angular/router';
import { FormulaService } from 'src/app/service/client-configuration/formula.service';
import { Token } from 'src/app/manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import * as moment from 'moment';
@Component({
  selector: 'app-formula-modal',
  templateUrl: './formula-modal.component.html',
  styleUrls: ['./formula-modal.component.css']
})
export class FormulaModalComponent implements OnInit {
  @Input() ClientData;
  @Input() data
  @Output() next_page = new EventEmitter<any>();
  @Output() Toggle = new EventEmitter<any>();
  @Output() getFormulaLookup = new EventEmitter<any>();
  userData;
  formula;
  disableSymbol: boolean = false;
  disableValue: boolean = false;
  ResponseHelper;
  showPopup: boolean = true
  token: Token;
  addFormula: FormGroup;
  validate: boolean = false;
  disableSave: boolean = false;
  Expression: string = "";
  btnString = "Update"
  update: boolean = true;
  @Input() FormulaValues;
  Id;
  Client_Inventory_Id;
  Client_Id
  Is_Active;
  Updated_Date
  constructor(public fb: FormBuilder, private router: Router, private service: FormulaService, private notificationServie: NotificationService) {
    this.addFormula = this.fb.group({
      "Id": [""],
      "Client_Inventory_Id": [""],
      "Client_Id": [],
      "Expression": ["", Validators.compose([Validators.required, Validators.maxLength(200)])],
      "Is_Active": [],
      "Updated_Date": []
    });
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData()
  }

  ngOnInit() {
    this.ResponseHelper = new ResponseHelper(this.notificationServie);
    this.Id = this.data[0].Id;
    this.Expression = this.data[0].Expression;
    if (this.Expression) {
      this.disableValue = true
    } else if (this.Expression == "") {
      this.disableValue = false;
      this.disableSymbol = true;
      this.update = false
    }
    this.Client_Id = this.data[0].Client_Id;
    this.Client_Inventory_Id = this.data[0].Client_Inventory_Id;
    this.Is_Active = this.data[0].Is_Active;
    this.Updated_Date = this.data[0].Updated_Date;
    if (this.formula || (this.Expression != "")) {
      this.update = true
    } else {
      this.update = false;
      this.Is_Active = false
    }
  }

  submitFrom() {

    if (this.addFormula.value.Updated_Date == "0001-01-01T00:00:00") {
      this.addFormula.patchValue({ "Updated_Date": moment(Date.now()).format('YYYY-MM-DDTHH:MM:SS') })
    }
    this.validate = true
    if (this.addFormula.valid) {
      this.disableSave = true
      if (!this.update) {
        this.service.saveFormula(this.addFormula.value).subscribe(res => {
          this.ResponseHelper.GetSuccessResponse(res)
          this.showPopup = false;
          this.Toggle.emit(this.showPopup);
          this.getFormulaLookup.emit()
          this.ClientData.Is_Formula_Uploaded = true;
          this.disableSave = false
        }, err => {
          this.ResponseHelper.GetFaliureResponse(err)
          this.disableSave = false
        })

      } else {
        this.service.updateFormula(this.addFormula.value).subscribe(res => {
          this.ClientData.Is_Formula_Uploaded = true;
          this.showPopup = false;
          this.Toggle.emit(this.showPopup);
          this.ResponseHelper.GetSuccessResponse(res)
          this.getFormulaLookup.emit()
          this.disableSave = false
        }, err => {
          this.ResponseHelper.GetFaliureResponse(err)
          this.disableSave = false
        })
      }
    }
    //
  }
  clearForm() {

    this.validate = false;
    this.Expression = "";
    this.update = true;
    this.disableValue = false;
    this.disableSymbol = true
  }

  creatFormula(id) {
    if (this.formula[id]) {
      if (this.formula[id].Expression != "") {
        this.update = true
      } else {
        this.update = false
      }
    }
  }
  closeModel() {
    this.showPopup = false;
    this.Toggle.emit(this.showPopup);
    this.validate = false;
    this.addFormula.reset();
  }

  restrict(e) {
    if (e.code == "Backspace") {
      return false
    }
    return false
  }
  appendExpression(val) {
    let abc = ['+', "-", '*', '/', '(', ')']

    if (abc.includes(val)) {
      if (this.disableSymbol) {
        return false
      }

      this.disableSymbol = true;
      this.disableValue = false
    } else {
      if (this.disableValue) {
        return false
      }
      val = '[' + val + ']'
      this.disableValue = true;
      this.disableSymbol = false
    }
    this.Expression = this.Expression.concat(val);
  }

  navigate() {
    this.next_page.emit('formula');
  }


}
