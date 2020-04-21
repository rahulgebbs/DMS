import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DropdownService } from 'src/app/service/client-configuration/dropdown.service';
import { Token } from 'src/app//manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-dropdown-modal',
  templateUrl: './dropdown-modal.component.html',
  styleUrls: ['./dropdown-modal.component.css']
})
export class DropdownModalComponent implements OnInit {
  addDropdown: FormGroup;
  @Input() ClientData;
  @Input() InventoryId;
  ResponseHelper;
  update: boolean = true
  Dropdownvalues;
  userData;
  Dropdown;
  valtoremove
  validate: boolean = false
  @Input() valueDropdown;
  @Input() singleDropDown;
  @Input() values;
  @Input() data;
  @Output() Toggle = new EventEmitter<any>();
  @Output() getDropdown = new EventEmitter<any>();
  showPopup: boolean = true;
  token: Token;
  checkvalidation: boolean = false;
  Client_Id;
  Client_Inventory_Id;
  Is_Active;
  Updated_Date
  Id;
  saveBtnDisable:boolean = true;
  resetBtnDisable:boolean = true

  constructor(private router: Router, public fb: FormBuilder, private service: DropdownService,
    private notificationService: NotificationService) {
    this.addDropdown = this.fb.group({
      "Client_Id": [""],
      "Client_Inventory_Id": [""],
      "Dropdown_Value": ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      "Is_Active": [],
      "Updated_Date": [],
      "Id": []
    });
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();
  }

  ngOnInit() {

    this.ResponseHelper = new ResponseHelper(this.notificationService);

    this.Is_Active = this.data[0].Is_Active;
    this.Client_Id = this.data[0].Client_Id;
    this.Client_Inventory_Id = this.data[0].Id;



    if (this.Updated_Date || !this.valueDropdown) {
      this.update = true
    } else {
      this.update = false;
      this.Is_Active = true;
    }
  }
  submitFrom() {
    this.checkvalidation = true
    this.validate = true
    if (this.addDropdown.valid) {
      this.saveBtnDisable = true
      this.resetBtnDisable = true
      if (this.update) {
        this.service.updateDropDown(this.addDropdown.value).pipe(finalize(()=>{
          this.saveBtnDisable = false
          this.resetBtnDisable = false
        })).subscribe(res => {
          this.ResponseHelper.GetSuccessResponse(res)
          let data = res.json();
          // this.singleDropDown = data.Data
          let i = { "Id": this.Client_Inventory_Id }
          //     this.getDropdown.emit(i)
          this.ClientData.Is_Dropdown_Uploaded = true;
          this.values.splice(this.valtoremove, 1);
          let val = { "Id": data.Data.Id, "values": data.Data.Dropdown_Value, "updatedT": data.Data.Updated_Date }
          this.values.push(val)
          this.validate = false
          this.saveBtnDisable = true
          this.resetBtnDisable = false
        }, err => {
          this.ResponseHelper.GetFaliureResponse(err)
          this.saveBtnDisable = false
          this.resetBtnDisable = false
        })
      } else {
        this.service.saveDropdown(this.addDropdown.value).pipe(finalize(()=>{
          this.saveBtnDisable = false
          this.resetBtnDisable = false
        })).subscribe(res => {
          this.ResponseHelper.GetSuccessResponse(res)
          let data = res.json()
          let i = { "Id": this.Client_Inventory_Id }
          let val = { "Id": data.Data.Id, "values": data.Data.Dropdown_Value, "updatedT": data.Data.Updated_Date }
          this.values.push(val)
          this.ClientData.Is_Dropdown_Uploaded = true;
          this.validate = false
        }, err => {
          this.ResponseHelper.GetFaliureResponse(err)
        })
      }
    }
  }
  closeModel() {
    this.Toggle.emit(this.showPopup);
    this.showPopup = false;
    this.ClientData.update = true;
    this.validate = false;
    this.addDropdown.reset()
  }
  updateCancel() {
    this.update = false;
    this.valueDropdown = []
    this.checkvalidation = false
    this.saveBtnDisable = true
    this.resetBtnDisable = true
  }
  selectValue(val, id) {
    this.valtoremove = id
    this.valueDropdown = val.values
    this.update = true
    this.Id = val.Id;
    this.Updated_Date = val.updatedT;
    this.saveBtnDisable = false
    this.resetBtnDisable = false
  }

  enableBtn(){
    this.saveBtnDisable = false
    this.resetBtnDisable = false
  }

}
