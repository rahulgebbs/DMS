import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-client-configuration',
  templateUrl: './client-configuration.component.html',
  styleUrls: ['./client-configuration.component.css']
})
export class ClientConfigurationComponent implements OnInit {
  title: string = "Client Configuration";
  clientData;
  ShowTabName = 'client';
  ClientComplete = true;
  // SaagComplete = false;
  // InsuranceComplete = false;
  // ProviderComplete = false;
  // InventoryComplete = false;
  // DropdownComplete = false;
  // FormulaComplete = false;
  TabError = false;
  constructor(private router: Router) {
  }

  ngOnInit() {
    this.clientData = {};
    this.clientData.Is_Dropdown_Uploaded = false;
    this.clientData.Is_Provider_Uploaded = false;
    this.clientData.Is_Formula_Uploaded = false;
    this.clientData.Is_Insurance_Uploaded = false;
    this.clientData.Is_Inventory_Uploaded = false;
    this.clientData.Is_SAAG_Uploaded = false;
    this.clientData.Is_Formula_Required = false;
    this.clientData.Is_Dropdown_Required = false;
  }

  next_page(e) {
    if (e == 'client') {
      this.ClientComplete = true;
      this.ShowTabName = 'saag';
    } else if (e == "saag") {
      this.clientData.Is_SAAG_Uploaded = true;
      this.ShowTabName = 'insurance';
    }
    else if (e == "insurance") {
      this.clientData.Is_Insurance_Uploaded = true;
      this.ShowTabName = 'provider';
    }
    else if (e == "provider") {
      this.clientData.Is_Provider_Uploaded = true;
      this.ShowTabName = 'inventory';
    }
    else if (e == "inventory") {
      this.clientData.Is_Inventory_Uploaded = true;
      this.ShowTabName = 'dropdown';
    }
    else if (e == "dropdown") {
      this.clientData.Is_Dropdown_Uploaded = true;
      this.ShowTabName = 'formula';
    }
    else if (e == "formula") {
      this.clientData.Is_Formula_Uploaded = true;
      // location.reload()
      this.ShowTabName = 'appeal';
    }
    else if (e == "appeal") {
      // this.clientData.Is_Appeal= true;
      location.reload()
    }
  }


  receiveClient(e) {
    this.clientData = e;
    // this.DropdownComplete = false;
    // if (e.Is_Dropdown_Uploaded) {
    //   this.DropdownComplete = true;
    // }
    // this.FormulaComplete = false;
    // if (e.Is_Formula_Uploaded) {
    //   this.FormulaComplete = true;
    // }
    // this.InsuranceComplete = false;
    // if (e.Is_Insurance_Uploaded) {
    //   this.InsuranceComplete = true;
    // }
    // this.InventoryComplete = false;
    // if (e.Is_Inventory_Uploaded) {
    //   this.InventoryComplete = true;
    // }
    // this.ProviderComplete = false;
    // if (e.Is_Provider_Uploaded) {
    //   this.ProviderComplete = true;
    // }
    // this.SaagComplete = false;
    // if (e.Is_SAAG_Uploaded) {
    //   this.SaagComplete = true;
    // }
  }

  navigation(access) {
    this.TabError = false;
    if (this.clientData != null && this.clientData.Id != undefined) {
      this.ShowTabName = access;
    }
    else {
      this.ShowTabName = 'client';
      this.TabError = true;
    }
  }

}
