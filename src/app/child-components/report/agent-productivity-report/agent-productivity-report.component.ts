import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/service/client-configuration/client.service';
import { Token } from 'src/app/manager/token';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
@Component({
  selector: 'app-agent-productivity-report',
  templateUrl: './agent-productivity-report.component.html',
  styleUrls: ['./agent-productivity-report.component.scss']
})
export class AgentProductivityReportComponent implements OnInit {
  productivityForm: FormGroup;
  agentReport = null;
  token: Token;
  userData;
  clientList = [];
  httpStatus = null;
  startDate;
  endDate;
  clientObj = null;
  ResponseHelper: ResponseHelper;
  defaultAgent = {};
  maxDate = new Date();

  constructor(
    private clientService: ClientService,
    private router: Router,
    private notification: NotificationService,
    private fb: FormBuilder
  ) {
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();
    console.log('constructor userData : ', this.userData);
    this.ResponseHelper = new ResponseHelper(this.notification);
    this.initForm();
    this.setDates();
  }

  ngOnInit() {

  }
  initForm() {
    this.productivityForm = this.fb.group({
      selectedMonth: [null, Validators.required],
    });
  }

  setDates() {
    const date = new Date(), y = date.getFullYear(), m = date.getMonth(), startDate = new Date(y, m, 1), endDate = new Date(y, m, date.getDate());
    this.productivityForm.patchValue({ startDate: startDate, endDate: endDate, selectedMonth: startDate });
  }

  formatDates() {
    const { selectedMonth } = this.productivityForm.value;

    this.startDate = moment(selectedMonth).startOf('month').format('MM-DD-YYYY');
    this.endDate = moment(selectedMonth).endOf('month').format('MM-DD-YYYY');
  }

  toggleNodes(nodeObj, role) {
    console.log('nodeObj, role : ', nodeObj, nodeObj[role]);
    const list = nodeObj[role];
    nodeObj.showRow = (nodeObj.showRow != undefined && nodeObj.showRow == true) ? false : true;
    if (list && list.length > 0) {
      // alert('No '+role.toUpperCase()+' to show');
      return false;
    }
    nodeObj.httpStatus = true;
    switch (role) {
      case 'dateRangeList': {
        this.getAgentReport(nodeObj)
        break;
      }
      default:
        break;
    }
  }

  getAgents() {
    this.httpStatus = true;
    this.agentReport = null;
    this.formatDates();
    this.clientService.getSingleAgentProductivityReport(this.userData.TokenValue, this.userData.Clients[0].Client_Id, this.userData.Employee_Code, this.startDate, this.endDate)
      .subscribe((response) => {
        console.log('getAgents response : ', response);
        this.setAgents(response.Data.agent_InventoryList_count[0]);
        this.httpStatus = false;
      }, (error) => {
        console.log('getAgents error : ', error);
        this.httpStatus = false;
        this.ResponseHelper.GetFaliureResponse(error);
      });
  }

  setAgents(agent) {
    this.agentReport = agent;
    this.agentReport['dateRangeList'] = [];
    this.httpStatus = false;
  }


  getAgentReport(nodeObj) {
    // nodeObj.httpStatus = true;
    this.clientService.getAgentReportByDate(this.userData.TokenValue, this.userData.Clients[0].Client_Id, this.userData.Employee_Code, 1, 1, 1, this.startDate, this.endDate)
      .subscribe((response) => {
        console.log('getAgentReport response : ', response);
        this.setAgentsReportDateWise(nodeObj, response.Data.manager_InventoryList_count)
        // nodeObj.httpStatus = false;
      }, (error) => {
        console.log('getAgents error : ', error);
        nodeObj.httpStatus = false;
        this.ResponseHelper.GetFaliureResponse(error)
      });

  }

  setAgentsReportDateWise(nodeObj, dateRangeList) {
    nodeObj.dateRangeList = dateRangeList;
    nodeObj.httpStatus = false;
  }

  chosenMonthHandler(month, datepicker) {
    const endDate = new Date(Number(moment(month).format('YYYY')), month.getMonth());
    const currentMonth = new Date().getMonth();
    console.log('currentMonth : ', month.getMonth(), currentMonth);
    if (month.getMonth() <= currentMonth) {
      this.productivityForm.patchValue({ selectedMonth: endDate })
      datepicker.close();
    }
    else {
      datepicker.close();
      // alert('Please don\'t select future months');
      // this.notification.ChangeNotification([{ Message: "Please don't select future dates !", Type: "ERROR" }])
    }

  }

  BlockInput(event) {
    if (event.key == 'Backspace' || event.key == 'Tab') {
      return true;
    }
    else {
      return false;
    }
  }

}
