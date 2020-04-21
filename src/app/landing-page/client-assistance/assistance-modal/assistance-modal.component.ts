import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { StandardCommentService } from 'src/app/service/standard-comment.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { ClientAssistanceService } from 'src/app/service/client-assistance.service';
import { SaagService } from 'src/app/service/client-configuration/saag.service';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-assistance-modal',
  templateUrl: './assistance-modal.component.html',
  styleUrls: ['./assistance-modal.component.css']
})
export class AssistanceModalComponent implements OnInit {
  @Input() Client_Id;
  @Input() HeaderStatus;
  @Input() InventoryCount;
  @Input() Inventories;
  @Input() TLAction;
  @Output() ClosePopup = new EventEmitter<any>();

  File;
  FileName;
  FileBase64 = '';
  StandardComments = [];
  AllChecked = false;
  DisableSubmit = true;
  ResponseHelper: ResponseHelper;
  ActionList = [
    // { Key: "Pending For Approval", Value: "Done" },
    { Key: "Send To Client", Value: "Approve" },
    { Key: "TL Deny", Value: "Deny" },
    { Key: "Gebbs Closed", Value: "Gebbs Close" },
    { Key: "SAAG Change", Value: "SAAG Change" }
  ];
  HideList = ["Id", "Inventory_Id", "Status", "Sub-Status", "Action_Code", "Effectiveness", "Action", "Reference_File_Name", "Standard_Comments", "Comments"];
  SaagLookup = [];
  CloseLookup = [];
  StatusList = [];
  CloseStatusList = [];

  SubStatusList = [];
  CloseSubStatusList = [];

  ActionCodeList = [];
  CloseActionCodeList = [];
  DisableDownload = false;

  Invalid = false;

  constructor(private standardCommentService: StandardCommentService, private notification: NotificationService, private service: ClientAssistanceService, private saagservice: SaagService) { }

  ngOnInit() {
    this.ResponseHelper = new ResponseHelper(this.notification)

    this.Inventories.forEach(e => {

      var Inventory_Log_Id = 0;
      var Status = '';
      var Sub_Status = ''
      var Action_Code = ''
      var Effectiveness = '';
      var stdComments = '';
      var comments = '';
      var refFileName = '';
      var action = '';
      e.forEach(inven => {
        switch (inven.Header_Name) {

          case 'Id':
            Inventory_Log_Id = inven.Field_Value;
            break;
          case 'Status':
            Status = inven.Field_Value;
            break;
          case 'Sub-Status':
            Sub_Status = inven.Field_Value;
            break;
          case 'Action_Code':
            Action_Code = inven.Field_Value;
            break;
          case 'Effectiveness':
            Effectiveness = inven.Field_Value;
            break;
          case 'Standard_Comments':
            stdComments = inven.Field_Value;
            break;
          case 'Comments':
            comments = inven.Field_Value;
            break;
          case 'Reference_File_Name':
            refFileName = inven.Field_Value;
            break;
          case 'Action':
            action = inven.Field_Value;
            break;
        }
      });
      e.Status = Status;
      e.AcStatus = Status;

      e.Sub_Status = Sub_Status;
      e.AcSubStatus = Sub_Status;

      e.Action_Code = Action_Code;
      e.AcActionCode = Action_Code;

      e.Effectiveness = Effectiveness;
      e.Inventory_Log_Id = Inventory_Log_Id;
      e.IsChecked = false;

      if (this.TLAction == 'Done') {
        e.FileName = 'Upload File';
      }
      else {
        if (refFileName != '') {
          e.FileName = refFileName;
        } else {
          e.FileName = 'No File Uploaded';
        }
      }


      if (this.TLAction != 'Done') {
        e.Action = this.TLAction;
        this.ActionList.forEach(er => {
          if (er.Value == e.Action) {
            e.Action = er.Key;
          }
        });

      }
      else {
        e.Action = '';
      }

      e.Standard_Comments = stdComments;
      // e.Action = '';
      e.Comments = '';
      // e.Reference_File_Name = refFileName;
      e.IsSAAGEditable = false;
    });

    this.GetStandardComments();
    this.GetSaagLookup();
    this.GetCloseSAAG();
  }

  OnGridReady(event) {

  }

  ToggleCheckAll(event) {
    if (event.currentTarget.checked) {
      this.Inventories.forEach(e => {
        e.IsChecked = true;
      });
      this.DisableSubmit = false;
    }
    else {
      this.Inventories.forEach(e => {
        e.IsChecked = false;
      });
      this.DisableSubmit = true;
    }
  }

  OnActionChange(i) {
    if (this.Inventories[i].Action == 'Gebbs Close') {
      this.Inventories[i].IsSAAGEditable = true;
      this.MapCloseSAAG(i);
    }
    else if (this.Inventories[i].Action == 'SAAG Change') {
      this.Inventories[i].IsSAAGEditable = true;
      this.MapSAAGFields(i);
    }
    else {
      this.Inventories[i].IsSAAGEditable = false;
      this.Inventories[i].Status = this.Inventories[i].AcStatus;
      this.Inventories[i].Sub_Status = this.Inventories[i].AcSubStatus;
      this.Inventories[i].Action_Code = this.Inventories[i].AcActionCode;
    }
    // this.CheckIfNoAction();
  }

  OnInventoryCheckboxChange(i) {
    if (this.Inventories.every(v => v.IsChecked == true)) {
      this.AllChecked = true;
    }
    else {
      this.AllChecked = false;
    }
    this.DisableSubmit = true;
    if (this.Inventories.some(x => x.IsChecked == true)) {
      this.DisableSubmit = false;
    }
    // this.CheckIfNoAction();
  }

  // CheckIfNoAction() {
  //   this.DisableSubmit = false;
  //   this.Inventories.forEach(e => {
  //     if (e.Action == '' && e.IsChecked == true) {
  //       this.DisableSubmit = true;
  //     }
  //   });
  //   if (this.Inventories.every(v => v.IsChecked == false)) {
  //     this.DisableSubmit = true;
  //   }
  // }

  GetCloseSAAG() {
    this.service.GetCloseSAAG(this.Client_Id).subscribe(
      res => {
        this.CloseLookup = res.json().Data.SAAG_Lookup;

      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    )
  }

  MapCloseSAAG(i) {
    let status = this.CloseLookup.map(function (obj) { return obj.Status; });
    this.CloseStatusList = status.filter(function (item, pos) { return status.indexOf(item) == pos; });

    let substatus = this.CloseLookup.map(function (obj) { return obj.Sub_Status; });
    this.CloseSubStatusList = substatus.filter(function (item, pos) {
      return substatus.indexOf(item) == pos;
    });

    let actionCode = this.CloseLookup.map(function (obj) { return obj.Action_Code; });
    this.CloseActionCodeList = actionCode.filter(function (item, pos) {
      return actionCode.indexOf(item) == pos;
    });

    this.Inventories[i].Status = '';
    this.Inventories[i].Sub_Status = '';
    this.Inventories[i].Action_Code = '';
  }

  MapSAAGFields(i) {

    var substatus = [];
    this.SaagLookup.forEach((ef) => {
      if (this.Inventories[i].Status == ef.Status) {
        substatus.push(ef.Sub_Status);
      }
    });

    this.SubStatusList = substatus.filter(function (item, pos) {
      return substatus.indexOf(item) == pos;
    });

    let actionCode = [];
    this.SaagLookup.forEach((ef) => {
      if (this.Inventories[i].Sub_Status == ef.Sub_Status && this.Inventories[i].Status == ef.Status) {
        actionCode.push(this.Inventories[i].Action_Code);
      }
    });

    this.ActionCodeList = actionCode.filter(function (item, pos) {
      return actionCode.indexOf(item) == pos;
    });

    this.Inventories[i].Status = '';
    this.Inventories[i].Sub_Status = '';
    this.Inventories[i].Action_Code = '';
  }

  OnStatusChange(i) {
    this.SubStatusList = [];
    let substatus = [];

    if (this.Inventories[i].Action === 'Gebbs Close') {
      this.CloseLookup.forEach(e => {
        if (e.Status == this.Inventories[i].Status) {
          substatus.push(e.Sub_Status)
        }
      })

      this.CloseSubStatusList = substatus.filter(function (item, pos) {
        return substatus.indexOf(item) == pos;
      })
    }
    else {

      this.SaagLookup.forEach(e => {
        if (e.Status == this.Inventories[i].Status) {
          substatus.push(e.Sub_Status)
        }
      })

      this.SubStatusList = substatus.filter(function (item, pos) {
        return substatus.indexOf(item) == pos;
      })
    }
  }

  OnSubStatusChange(i) {
    this.ActionCodeList = [];
    let actionCode = [];

    if (this.Inventories[i].Action === 'Gebbs Close') {
      this.CloseLookup.forEach(e => {
        if (e.Sub_Status == this.Inventories[i].Sub_Status && e.Status == this.Inventories[i].Status) {
          actionCode.push(e.Action_Code)
        }
      })

      this.CloseActionCodeList = actionCode.filter(function (item, pos) {
        return actionCode.indexOf(item) == pos;
      })
    }
    else {
      this.SaagLookup.forEach(e => {
        if (e.Sub_Status == this.Inventories[i].Sub_Status && e.Status == this.Inventories[i].Status) {
          actionCode.push(e.Action_Code)
        }
      })

      this.ActionCodeList = actionCode.filter(function (item, pos) {
        return actionCode.indexOf(item) == pos;
      })
    }
  }


  GetSaagLookup() {
    this.StatusList = [];
    this.saagservice.getSaagLookup(this.Client_Id).subscribe(data => {
      this.SaagLookup = data.json().Data.SAAG_Lookup;
      let status = this.SaagLookup.map(function (obj) { return obj.Status; });
      this.StatusList = status.filter(function (item, pos) { return status.indexOf(item) == pos; })


    }, err => {
      this.ResponseHelper.GetFaliureResponse(err)
    })
  }

  GetStandardComments() {
    this.standardCommentService.GetAllStandardComment(this.Client_Id).subscribe(
      res => {
        this.StandardComments = res.json().Data;
        // if (this.TLAction == 'Done') {
        //   this.Inventories.forEach(e => {
        //     e.Standard_Comments = this.StandardComments[0].Comment;
        //   });
        // }
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    )
  }

  GetReferenceFile(filename) {
    this.DisableDownload = true;
    this.service.GetReferenceFile(filename).pipe(finalize(() => {
      this.DisableDownload = false;
    })).subscribe(
      (res: any) => {
        var url = window.URL.createObjectURL(res.data);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    )
  }

  OnFileChange(event, i) {
    if (event.target.files && event.target.files.length > 0) {
      this.File = event.target.files[0];
      this.FileName = this.File.name;
      this.Inventories[i].FileName = this.FileName;
      this.ConvertToBase64(i);
    }
    else {
      this.Inventories[i].FileName = 'Upload File';
      this.File = null;
      this.FileBase64 = '';
    }
  }

  ConvertToBase64(i) {
    let reader = new FileReader();
    reader.readAsDataURL(this.File);
    reader.onload = () => {
      this.FileBase64 = reader.result.toString().split(',')[1];
      this.Inventories[i].File = this.FileBase64;
    };

  }

  Submit() {
    this.Invalid = false;
    this.Inventories.forEach(e => {
      if (e.IsChecked) {
        if (e.Action == '' || e.Standard_Comments == '') {
          this.Invalid = true;
        }
      }
    });

    if (!this.Invalid) {

      var response = [];
      this.Inventories.forEach(e => {
        if (e.IsChecked === true) {
          response.push(
            { Client_Id: this.Client_Id, Inventory_Log_Id: e.Inventory_Log_Id, Action: e.Action, Standard_Comments: e.Standard_Comments, Comments: e.Comments, File: e.File, FileName: e.FileName, Status: e.Status, Sub_Status: e.Sub_Status, Action_Code: e.Action_Code }
          )
        }
      });
      var obj = new Object();
      obj['request_info'] = response;
      // console.log(obj);
      this.DisableSubmit = true;
      this.service.SaveInventories(obj).pipe(finalize(() => {
        this.DisableSubmit = false;
      })).subscribe(
        res => {
          this.ResponseHelper.GetSuccessResponse(res);
          this.ClosePopup.emit(true);
        },
        err => {
          this.ResponseHelper.GetFaliureResponse(err);
        }
      );
    }
  }

  Close() {
    this.ClosePopup.emit(false);
  }

}
