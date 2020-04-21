import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
// import { EventEmitter } from 'events';
// import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { fieldList } from '../fieldList';
// import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import * as _ from 'lodash';
import * as $ from 'jquery';
import { ClientService } from 'src/app/service/client-configuration/client.service';
import { Token } from 'src/app/manager/token';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
// import { $ } from 'protractor';

@Component({
  selector: 'app-add-client-user-mapping-management',
  templateUrl: './add-client-user-mapping-management.component.html',
  styleUrls: ['./add-client-user-mapping-management.component.scss']
})
export class AddClientUserMappingManagementComponent implements OnInit {
  @Output() close = new EventEmitter();
  fieldArray = JSON.parse(JSON.stringify(fieldList));
  submitted = false;
  token;
  httpStatus = false;
  userData;
  ResponseHelper: ResponseHelper;
  questionList = [];
  constructor(private router: Router,
    private cdr: ChangeDetectorRef,
    private notificationservice: NotificationService,
    private clientService: ClientService) {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }

  ngOnInit() {
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();
    // setTimeout(() => {
    //   this.initFields();
    // }, 500);

  }

  closeModal() {
    console.log('close modal')
    this.close.emit('add-modal');
  }

  initFields() {
    console.log('fieldList : ', fieldList);

  }

  submit() {
    console.log('submit() : ', this.fieldArray);
    this.submitted = true;
    const finalObj = {};
    finalObj['createdBy'] = this.userData.UserId;
    this.fieldArray.forEach((element: any) => {
      if (element.key == 'Drug_Test') {
        if (element.value == null || element.value.length == 0) {
          finalObj[element.key] = "No Data Found";
        }
      }
      else {
        finalObj[element.key] = element.value;
      }
    });
    let message = null;
    const matchedResult = _.find(this.fieldArray, (field) => {
      if (field.required == true) {
        if (field.value == null || field.value.length == 0) {
          message = 'Please fill all the required fields';
          return field;
        }
        if (field.duplicate == true) {
          message = 'Please check, fields are duplicate';
          return field
        }

      }
    })

    console.log('matchedResult : ', matchedResult);
    if (matchedResult != null && matchedResult != undefined) {
      var elmnt = document.getElementById(matchedResult.key);
      elmnt.scrollIntoView();
      this.notificationservice.ChangeNotification([{ Message: message, Type: "ERROR" }])
      console.log("$('#' + matchedResult.key).offset() : ", $('#' + matchedResult.key).offset());
      return null;
    }
    console.log('================== success for add : ', finalObj);
    this.httpStatus = true;
    this.clientService.addClientUserMapping(this.userData.TokenValue, finalObj).subscribe((response) => {
      console.log('response : ', response);
      this.notificationservice.ChangeNotification(response.Message);
      this.close.emit('add-modal');
      this.httpStatus = false;

    }, (error) => {
      console.log('error : ', error);
      this.httpStatus = false;
      this.ResponseHelper.GetFaliureResponse(error);
    });
  }

  getECNInfo(field) {
    console.log('field : ', field);
    this.submitted = false;
    if (field.key != 'ECN') {
      return false;
    }
    if (field.value == null || field.value.length == 0) {
      return false;
    }
    this.clientService.getECNInfo(this.userData.TokenValue, field.value).subscribe((response: any) => {
      console.log('response : ', response);
      this.submitted = false;
      this.populateData(response.Data);
    }, (error) => {
      console.log('error : ', error);
      this.submitted = false;
      this.ResponseHelper.GetFaliureResponse(error);
    });
  }


  populateData(userData) {
    const { Myspace, Process, Get_Popup_Question } = userData;
    this.checkOWN();
    if (this.questionList && this.questionList.length == 0) {
      this.questionList = Get_Popup_Question;
    }
    this.fieldArray.forEach((field) => {
      if (field.key == 'Process_Name') {
        field.options = [];
        Process.forEach((process) => {
          field.options.push(process.Process_Name);
        });
      }
      else if (field.key == 'Drug_Test') {
        if (field.value == null || field.value.length == 0) {
          field.value = "No Data Found";
        }
      }
      else {
        if (field.editable == false) {
          field.value = Myspace[0][field.key];
        }
      }
    });
  }

  checkOWN() {
    // console.log('checkOWN() : ');
    let ECN = null, Original_ECN = null, ownIndex = null;
    this.fieldArray.forEach((field, index) => {

      if (field.key == 'ECN') {
        ECN = field.value;
      }
      if (field.key == 'Original_ECN') {
        Original_ECN = field.value;
      }
      if (field.key == 'OWN') {
        ownIndex = index;
      }
    });
    if (ECN == Original_ECN) {
      this.fieldArray[ownIndex].value = 'Yes';
    }
    else {
      this.fieldArray[ownIndex].value = 'No';
    }
    console.log('ECN , Original_ECN : ', ECN, Original_ECN, ownIndex)
    console.log('ownIndex : ', ownIndex, this.fieldArray[ownIndex])
  }

  checkOriginalECN(field) {
    if (field.key == 'Original_ECN') {
      this.checkOWN();
    }
  }

  validateQuestion(question) {
    console.log('validateQuestion(question) : ', question);
    const questionList = _.filter(this.fieldArray, (question) => {
      return question.type == 'question'
    });
    const result = _.find(questionList, (field) => {
      if (field.key != question.key && field.type == 'question') {
        if (field.value == question.value) {
          return field.value;
        }
      }
    });
    console.log('result : ', result);
    if (result != undefined) {
      question.duplicate = true;
    }
    else {
      question.duplicate = false;
    }
    this.checkAllFields();
  }

  checkAllFields() {
    this.fieldArray.every((question) => {
      const result = _.find(this.fieldArray, (field) => {
        if (field.key != question.key && field.type == 'question') {
          if (field.value == question.value) {
            return field.value;
          }
        }
      });
      console.log('checkAllFields result : ', result);
      if (result == undefined) {
        question.duplicate = false;
      }
    })


  }

}
