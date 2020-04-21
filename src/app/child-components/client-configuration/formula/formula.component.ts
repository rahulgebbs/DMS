import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { Router } from '@angular/router';
import { FormulaService } from '../../../service/client-configuration/formula.service';
import { Token } from '../../../manager/token';
import { NotificationService } from 'src/app/service/notification.service';
@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})
export class FormulaComponent implements OnInit {
  @Input() ClientData;
  @Output() next_page = new EventEmitter<any>();
  userData;
  formula;
  ResponseHelper;
  showPopup: boolean = false
  token: Token;
  validate: boolean = false;
  Expression: string = "";
  update: boolean = true;
  FormulaValues;
  Id;
  Client_Inventory_Id;
  Client_Id
  Is_Active;
  Updated_Date;
  data: any[] = []
  constructor(private router: Router, private service: FormulaService, private notificationServie: NotificationService) {

    this.token = new Token(this.router);
    this.userData = this.token.GetUserData()
  }

  ngOnInit() {
      
    if (this.ClientData.Is_Formula_Required) {
      this.getFormulaLookup();
    }
    else {
      this.formula = '';
    }
    this.ResponseHelper = new ResponseHelper(this.notificationServie);
  }

  getFormulaLookup() {

    this.service.getFormulaLookup(this.ClientData.Id).subscribe(res => {        

      let data = res.json();
      this.formula = data.Data;

    }, err => {
      this.formula = ''
      this.ResponseHelper.GetFaliureResponse(err)
    })

  }

  getFormulaValue() {

    this.service.getFormulaValues(this.ClientData.Id,this.Client_Inventory_Id).subscribe(res => {

      let data = res.json()
      this.FormulaValues = []
      this.FormulaValues = data.Data

    }, err => {
        
      this.ResponseHelper.GetFaliureResponse(err)
    })
  }
  creatFormula(id) {
    this.getFormulaValue()
    this.Client_Id = this.ClientData.Id;
    this.Client_Inventory_Id = id.Client_Inventory_Id;
    this.Id = id.Formula_Id;
    this.Expression = id.Expression;
    this.Is_Active=id.Is_Active;
    this.Updated_Date=id.Updated_Date
    this.service.getSingelFormula(this.ClientData.Id, id.Formula_Id).pipe(finalize(() => {
      this.data = [{
        "Id": this.Id, "Expression": this.Expression, "Client_Id": this.Client_Id,
        "Is_Active": this.Is_Active, "Updated_Date": this.Updated_Date, "Client_Inventory_Id": this.Client_Inventory_Id,
      }]
      this.showPopup = true;
    })).subscribe(res => {
          
      let data = res.json();

      this.Expression = data.Data.Expression;

      this.Is_Active = data.Data.Is_Active;
      this.Updated_Date = data.Data.Updated_Date;


    }, err => {
        
      this.ResponseHelper.GetFaliureResponse(err)
    })


  }

  closeModel() {
    this.showPopup = false;
  }
  navigate() {
    this.next_page.emit('formula');
  }
  ToggleModal(event) {
    this.showPopup = false;
  }


}
