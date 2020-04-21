import { Component, OnInit, EventEmitter, Output, Input, HostListener } from '@angular/core';
import {  FormBuilder, Validators } from '@angular/forms';
import { AgentService } from 'src/app/service/agent.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { Token } from 'src/app//manager/token';
@Component({
  selector: 'app-break-popup',
  templateUrl: './break-popup.component.html',
  styleUrls: ['./break-popup.component.css']
})
export class BreakPopupComponent implements OnInit {
  @Output() Toggle = new EventEmitter<any>();
  @Input() agentBreak;
  BreakStarted: boolean = false;
  ResponseHelper: ResponseHelper;
  validate: boolean = false;
  Break;
  Break_Type;
  Break_Res;
  token: Token
  constructor(public fb: FormBuilder, private agentService: AgentService, private notificationservice: NotificationService, ) {
    localStorage.setItem('BreakStatus', this.BreakStarted.toString())
    this.Break_Type = "0"
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    this.Break = this.fb.group({
      "Client_Id": [""],
      "Break_Type": ["", Validators.compose([Validators.required, Validators.pattern('^[^0-9]+$')])],
      "Inventory_Log_Id": [""],
    })
  }
  ngOnInit() {
  }

  closeModel() {
    this.Toggle.emit();
  }

  submitFrom() {
    this.validate = true
    if (this.Break.valid) {
      if (!this.BreakStarted) {
        this.Break.patchValue({ "Client_Id": this.agentBreak.Client_Id });
        this.Break.patchValue({ "Inventory_Log_Id": this.agentBreak.InventoryLogId })
        this.agentService.startBreak(this.Break.value)
          .subscribe(res => {
            this.Break.get('Break_Type').disable()
            this.Break_Res = res.json().Data;
            this.BreakStarted = true;
            let resumeBreak = {
              "Id": this.Break_Res.Id,
              "Client_Id": this.Break_Res.Client_Id,
              "Start_Time": this.Break_Res.Start_Time,
              "Inventory_Log_Id": this.Break_Res.Inventory_Log_Id
            }
            sessionStorage.setItem('BreakStatus', this.BreakStarted.toString());
            sessionStorage.setItem('resumeBreak', JSON.stringify(resumeBreak));
            this.ResponseHelper.GetSuccessResponse(res);
          }, err => {
            this.ResponseHelper.GetFaliureResponse(err);
            this.BreakStarted = false
          })

      } else {
        this.validate = false
        if (this.Break_Res) {
          let resumeBreak = {
            "Id": this.Break_Res.Id,
            "Client_Id": this.Break_Res.Client_Id,
            "Start_Time": this.Break_Res.Start_Time,
            "Inventory_Log_Id": this.Break_Res.Inventory_Log_Id
          }
          this.agentService.endBreak(resumeBreak).subscribe(res => {
            this.BreakStarted = false;
            sessionStorage.setItem('BreakStatus', this.BreakStarted.toString());
            sessionStorage.setItem('resumeBreak', null);
            this.ResponseHelper.GetSuccessResponse(res);
            this.Toggle.emit();
          }, err => {
            this.BreakStarted = false;
            this.ResponseHelper.GetFaliureResponse(err);
          })

        }
      }
    } else {
      event.preventDefault()
      event.stopPropagation()

    }
  }

}
