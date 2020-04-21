import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges } from '@angular/core';
// import { EventEmitter } from 'events';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { fieldList } from '../fieldList';
// import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


import * as _ from 'lodash';
import * as $ from 'jquery';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { Token } from 'src/app/manager/token';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/service/client-configuration/client.service';
@Component({
  selector: 'app-edit-client-user-mapping-management',
  templateUrl: './edit-client-user-mapping-management.component.html',
  styleUrls: ['./edit-client-user-mapping-management.component.scss']
})
export class EditClientUserMappingManagementComponent implements OnInit, OnChanges {
  @Output() close = new EventEmitter();
  @Input() user;
  fieldArray = JSON.parse(JSON.stringify(fieldList));
  dropdownSettings;
  submitted = false;
  token;
  httpStatus = false;
  userData;
  ResponseHelper: ResponseHelper;
  questionList = [];

  constructor(private formBuilder: FormBuilder,
    // private activeModal: NgbActiveModal,
    private clientService: ClientService,
    private router: Router,
    private notificationservice: NotificationService,
    private cdr: ChangeDetectorRef) {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);

  }

  ngOnInit() {

  }

  ngOnChanges(changes) {
    console.log('changes : ', changes);
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();
    setTimeout(() => {
      this.initFields();
    }, 500);
  }
  closeModal() {
    this.close.emit('edit-modal');
  }

  initFields() {
    console.log('initFields() : ', this.user);
    this.getECNInfo('ECN', this.user.ECN);
    this.fieldArray.forEach((element: any) => {
      element.value = this.user[element.key];
      // element.dropdownSettings = {
      //   singleSelection: false,
      //   // idField: 'userbucket',
      //   // textField: 'BucketName',
      //   selectAllText: 'Select All',
      //   unSelectAllText: 'UnSelect All',
      //   itemsShowLimit: 2,
      //   allowSearchFilter: true,
      // }
    });

  }

  getECNInfo(key, ECN) {
    console.log('ECN : ', ECN);
    this.submitted = false;
    if (key != 'ECN') {
      return false;
    }
    // if (field.value == null || field.value.length == 0) {
    //   return false;
    // }
    if (ECN == null || ECN == 0) {
      return false;
    }
    this.clientService.getECNInfo(this.userData.TokenValue, ECN).subscribe((response: any) => {
      console.log('response : ', response);
      this.submitted = false;
      this.populateData(ECN, response.Data);
    }, (error) => {
      console.log('error : ', error);
      // this.notificationservice.ChangeNotification(error.Message);
      this.ResponseHelper.GetFaliureResponse(error);
      this.submitted = false;
    });
  }

  // populateData(ECN, userData) {
  //   const { Myspace, Process } = userData;
  //   this.checkOWN();
  //   this.fieldArray.forEach((field) => {
  //     if (field.key == 'Process_Name') {
  //       field.options = [];
  //       Process.forEach((process) => {
  //         field.options.push(process.Process_Name);
  //       });
  //     }
  //     else {
  //       console.log('Myspace[0].ECN, this.user.ECN : ', Myspace[0].ECN, this.user.ECN);
  //       if (Number(Myspace[0].ECN) != Number(this.user.ECN)) {
  //         field.value = Myspace[0][field.key]
  //       }
  //       else if (field.value == null || field.value.length == 0) {
  //         field.value = Myspace[0][field.key]
  //       }
  //       else {
  //         // field.value = Myspace[0][field.key]
  //       }
  //     }
  //   });
  //   this.user.ECN = ECN;
  //   this.cdr.detectChanges();
  // }

  populateData(ECN, userData) {
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
        // if (field.value == null || field.value.length == 0) {
        //   field.value = Myspace[0][field.key]
        // }
        // else {
        //   field.value = Myspace[0][field.key]
        // }
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
    console.log('validateQuestion result : ', result, question);
    if (result != undefined) {
      question.duplicate = true;
    }
    else {
      question.duplicate = false;
    }
    this.checkAllFields();
  }

  checkAllFields() {
    this.fieldArray.forEach((question) => {
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

  submit() {

    console.log('submit() : ', this.fieldArray);
    this.submitted = true;
    const finalObj = {};
    this.fieldArray.forEach((element: any) => {
      finalObj[element.key] = element.value;
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
    this.httpStatus = true;

    finalObj['ClientUserMappingManagement_Id'] = this.user.ClientUserMappingManagement_Id;
    finalObj['modifiedBy'] = this.userData.UserId;
    this.clientService.updateClientUserMapping(this.userData.TokenValue, finalObj).subscribe((response) => {
      console.log('response : ', response);
      this.httpStatus = false;
      this.close.emit('edit-modal');
      this.notificationservice.ChangeNotification(response.Message);

    }, (error) => {
      console.log('error : ', error);
      this.httpStatus = false;
      this.ResponseHelper.GetFaliureResponse(error);
    });
  }

}