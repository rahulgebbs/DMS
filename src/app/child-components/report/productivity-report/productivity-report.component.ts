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
    selector: 'app-productivity-report',
    templateUrl: './productivity-report.component.html',
    styleUrls: ['./productivity-report.component.scss']
})
export class ProductivityReportComponent implements OnInit {
    productivityForm: FormGroup;
    treeData = [];
    token: Token;
    userData;
    clientList = [];
    httpStatus = false;
    startDate;
    endDate;
    clientObj = null;
    ResponseHelper: ResponseHelper;
    maxDate = new Date();

    constructor(
        private clientService: ClientService,
        private router: Router,
        private notification: NotificationService,
        private fb: FormBuilder
    ) {
        this.token = new Token(this.router);
        this.userData = this.token.GetUserData();
        this.ResponseHelper = new ResponseHelper(this.notification);
    }
    ngOnInit() {
        this.getClientList();
        this.initForm();
        this.setDates();
    }

    initForm() {
        this.productivityForm = this.fb.group({
            processName: ['', Validators.required],
            reportType: ['', Validators.required],
            startDate: [null, Validators.required],
            endDate: [null, Validators.required],
            selectedMonth: [null, Validators.required]
        });
    }
    setDates() {
        const date = new Date(), y = date.getFullYear(), m = date.getMonth(), startDate = new Date(y, m, 1), endDate = new Date(y, m, date.getDate());
        this.productivityForm.patchValue({ startDate: startDate, endDate: endDate, selectedMonth: startDate });
    }

    BlockInput(event) {
        console.log('event : ', event.key)
        if (event.key == 'Backspace' || event.key == 'Tab') {
            return true;
        }
        else {
            return false;
        }
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
            case 'manager': {
                nodeObj.manager = [];
                // nodeObj.showRow = (nodeObj.showRow != undefined && nodeObj.showRow == true) ? false : true;
                this.getManagers(nodeObj);
                break;
            }
            case 'supervisor': {
                nodeObj.supervisor = [];
                // nodeObj.showRow = (nodeObj.showRow != undefined && nodeObj.showRow == true) ? false : true;
                this.getSupervisors(nodeObj)
                break;
            }
            case 'agent': {
                nodeObj.agent = [];
                // nodeObj.showRow = (nodeObj.showRow != undefined && nodeObj.showRow == true) ? false : true;
                this.getAgents(nodeObj);
                break;
            }
            case 'dateRangeList': {
                this.getAgentReport(nodeObj)
                break;
            }
            default:
                break;
        }
    }

    refreshReport(nodeObj, role) {
        // console.log('nodeObj, role : ', nodeObj, nodeObj[role]);
        // const list = nodeObj[role];
        // if(list && list.length>0)
        // {
        //     // alert('No '+role.toUpperCase()+' to show');
        //     return false;
        // }
        console.log('refreshReport nodeObj : ', nodeObj.refreshStatus);
        if (nodeObj.refreshStatus == true) {
            return false;
        }
        nodeObj.showRow = true;
        nodeObj.refreshStatus = true;
        nodeObj.httpStatus = true;
        switch (role) {
            case 'manager': {
                // nodeObj.manager = [];
                // nodeObj.showRow = (nodeObj.showRow != undefined && nodeObj.showRow == true) ? false : true;
                this.getManagers(nodeObj);
                break;
            }
            case 'supervisor': {
                nodeObj.supervisor = [];
                // nodeObj.showRow = (nodeObj.showRow != undefined && nodeObj.showRow == true) ? false : true;
                this.getSupervisors(nodeObj)
                break;
            }
            case 'agent': {
                nodeObj.agent = [];
                // nodeObj.showRow = (nodeObj.showRow != undefined && nodeObj.showRow == true) ? false : true;
                this.getAgents(nodeObj);
                break;
            }
            case 'dateRangeList': {
                this.getAgentReport(nodeObj)
                break;
            }
            default:
                break;
        }
    }

    getClientList() {

        this.clientService.getClientList(this.userData.TokenValue).subscribe((response) => {
            console.log('response : ', response);
            if (response) {

                this.clientList = response.json().Data;
                // this.ResponseHelper.GetSuccessResponse(response);
            }

        }, (error) => {
            console.log('error : ', error);;
            this.ResponseHelper.GetFaliureResponse(error);

        });
    }

    formatDates() {
        const { startDate, endDate, selectedMonth, reportType } = this.productivityForm.value;
        if (reportType == 'month') {
            this.startDate = moment(selectedMonth).startOf('month').format('MM-DD-YYYY');
            this.endDate = moment(selectedMonth).endOf('month').format('MM-DD-YYYY')
        }
        else {
            this.startDate = moment(startDate).format('MM-DD-YYYY');
            this.endDate = moment(endDate).format('MM-DD-YYYY')
        }
    }

    chosenMonthHandler(month, datepicker) {
        let endDate = new Date(Number(moment(month).format('YYYY')), month.getMonth(), new Date().getDate());
        const today = new Date();
        console.log('currentMonth : ', month.getMonth(), today.getMonth(), today.getFullYear());
        if (month.getMonth() <= today.getMonth() && month.getFullYear() == today.getFullYear()) {
            this.productivityForm.patchValue({ selectedMonth: endDate });
            datepicker.close();
        }
        else if (month.getFullYear() != today.getFullYear()) {
            this.productivityForm.patchValue({ selectedMonth: endDate });
            datepicker.close();
        }
        else {
            datepicker.close();
            endDate = new Date(Number(moment().format('YYYY')), new Date().getMonth(), new Date().getDate());
            this.productivityForm.patchValue({ selectedMonth: endDate });
            // alert('Please don\'t select future months');
            //   this.notification.ChangeNotification([{ Message: "Please don't select future dates !", Type: "ERROR" }])
        }

    }

    getCLientReport() {
        this.treeData = [];
        console.log('form value : ', this.productivityForm.value);
        this.formatDates();
        this.httpStatus = true;
        this.clientService.getClientProductivityReport(this.userData.TokenValue, this.productivityForm.value['processName'], this.startDate, this.endDate).subscribe((response) => {
            console.log('response : ', response);
            this.setClient(response.Data.inventoryList);
            this.httpStatus = false;
        }, (error) => {
            console.log('error : ', error);
            this.ResponseHelper.GetFaliureResponse(error);
            this.httpStatus = false;
            this.treeData = []
        });
    }

    setClient(clientList) {
        // const result = httpResponse.Data.inventoryList;
        const client: any = { ClientID: clientList[0].ClientID };
        // const sum = _.sumBy(clientList, (ele) => {
        //     return Number(ele.Count);
        // });
        // client.total = sum;
        // console.log('sum : ', sum);
        clientList.forEach((element: any) => {
            // element.manager = [];
            client[element.Effectiveness.toUpperCase().replace(/[- ]/g, '_')] = element.Count;
            client.showRow = false;
            console.log('getClientList : ', element.Effectiveness, element.Count);
            if (element.Effectiveness == 'Total') {
                client['TOTAL_BALANCE'] = element.Total_Balance;
            }
        });
        this.treeData = [client];
        console.log('getClientList : ', this.treeData);
    }

    getManagers(nodeObj) {
        // nodeObj.httpStatus = true;
        console.log('getManagers : ', nodeObj);
        this.clientService.getManagerProductivityReport(this.userData.TokenValue, this.productivityForm.value['processName'], 1, this.startDate, this.endDate).subscribe((response) => {
            console.log('response : ', response);
            this.setManager(nodeObj, response.Data.manager_InventoryList_count);
        }, (error) => {
            console.log('error : ', error);
            nodeObj.httpStatus = false;
            nodeObj.refreshStatus = false;
            this.ResponseHelper.GetFaliureResponse(error);
            nodeObj.manager = [];
        });
    }

    setManager(nodeObj, managerList) {
        console.log('setManager : ', nodeObj, managerList);
        managerList.forEach((element: any) => {
            element.supervisor = []
        });
        nodeObj.manager = managerList;
        nodeObj.httpStatus = false;
        nodeObj.refreshStatus = false;
    }

    getSupervisors(nodeObj) {
        console.log('getSupervisors nodeObj : ', nodeObj);
        // nodeObj.httpStatus = true;
        const { startDate, endDate } = this.productivityForm.value;
        this.clientService.getSupervisorProductivityReport(this.userData.TokenValue, this.productivityForm.value['processName'], nodeObj.EmployeeID, 1, this.startDate, this.endDate).subscribe((response) => {
            console.log('response : ', response)
            this.setSupervisor(nodeObj, response.Data.manager_InventoryList_count);
        }, (error) => {
            console.log('error : ', error);
            nodeObj.httpStatus = false;
            nodeObj.supervisor = [];
            this.ResponseHelper.GetFaliureResponse(error);
        })
    }

    setSupervisor(nodeObj, supervisorList) {
        console.log('setSupervisor : ', nodeObj, supervisorList);
        supervisorList.forEach((element: any) => {
            element.agent = [];
            element.managerId = nodeObj.EmployeeID;
        });
        nodeObj.supervisor = supervisorList;
        nodeObj.httpStatus = false;
    }

    getAgents(nodeObj) {
        // nodeObj.httpStatus = true;
        const { startDate, endDate } = this.productivityForm.value;
        this.clientService.getAgentProductivityReport(this.userData.TokenValue, this.productivityForm.value['processName'], nodeObj.EmployeeID, 1, 1, this.startDate, this.endDate)
            .subscribe((response) => {
                console.log('getAgents response : ', response);
                // nodeObj.httpStatus = false;
                this.setAgents(nodeObj, response.Data.manager_InventoryList_count);
            }, (error) => {
                console.log('getAgents error : ', error);
                nodeObj.httpStatus = false;
                this.ResponseHelper.GetFaliureResponse(error);
            });
    }

    setAgents(nodeObj, agentList) {
        agentList.forEach((element: any) => {
            element.dateRangeList = []
        });
        nodeObj.agent = agentList;
        nodeObj.httpStatus = false;
    }


    getAgentReport(nodeObj) {
        // nodeObj.httpStatus = true;
        const { startDate, endDate } = this.productivityForm.value;
        this.clientService.getAgentReportByDate(this.userData.TokenValue, this.productivityForm.value['processName'], nodeObj.EmployeeID, 1, 1, 1, this.startDate, this.endDate)
            .subscribe((response) => {
                console.log('getAgentReport response : ', response);
      
                this.setAgentsReportDateWise(nodeObj, response.Data.manager_InventoryList_count)
            }, (error) => {
                console.log('getAgents error : ', error);
                nodeObj.httpStatus = false;
                this.ResponseHelper.GetFaliureResponse(error)
            });
    }

    setAgentsReportDateWise(nodeObj, dateRangeList) {
        // agentList.forEach((element: any) => {
        //     element.dateRangeList = []
        // });
        nodeObj.dateRangeList = dateRangeList;
        nodeObj.httpStatus = false;
    }
    changeClient(event) {
        // console.log('changeClient() : ',event);
        const client = this.productivityForm.value['processName'];
        // console.log('client : ',client);
        this.clientObj = _.find(this.clientList, (clientObj) => {
            // console.log('clientObj : ',clientObj);
            return clientObj.Id.toString() == client.toString();
        });
        // console.log('this.clientObj : ',this.clientObj);
        this.treeData = [];
        this.httpStatus = null;
    }
}
