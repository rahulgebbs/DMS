import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { SupervisorAgentService } from 'src/app/service/supervisor-agent.service';


@Component({
  selector: 'app-client-instructions-modal',
  templateUrl: './client-instructions-modal.component.html',
  styleUrls: ['./client-instructions-modal.component.css']
})
export class ClientInstructionsModalComponent implements OnInit {
  @Input() ClientUpdateData;
  @Output() CloseModal = new EventEmitter<any>();
  ResponseHelper: ResponseHelper;
  RowSelection = 'single';
  columnDefs = [
    { headerName: 'Created/Modified Date', field: 'Created_Date', cellRenderer: this.FormatDate },
    { headerName: 'Payer Name', field: 'Payer_Name' },
    { headerName: 'Practice Name', field: 'Practice_Name' },
    { headerName: 'Provider Name', field: 'Provider_Name' },
    { headerName: 'Instructions', field: 'Instructions' },
    { headerName: 'Active/De-Active', field: 'Is_Active' },
    { headerName: 'Status', field: 'Type' },
    { headerName: 'Action', field: 'Read_By', cellRenderer: this.ActionCellRendererClass }
  ]

  constructor(private notificationservice: NotificationService, private service: SupervisorAgentService) { }

  ngOnInit() {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }

  FormatDate(params) {
    return moment(params.value).format('MM/DD/YYYY')
  }

  OnGridReady(event) {
    if (this.ClientUpdateData != null) {
      var allColumnIds = [];
      event.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
      });
      event.columnApi.autoSizeColumns(allColumnIds);
    }
  }

  ActionCellRendererClass(params) {
    let val
    let eDiv = document.createElement('div');
    if (!params.value) {
      val = 'Accept'
      eDiv.innerHTML = '<button  class="btn label gray label-info square-btn cursor update" data-action-type="update">' + val + '</button>';
    } else {
      val = "Accepted"
      eDiv.innerHTML = '<button  class="btn label gray label-info square-btn cursor"  disabled="" >' + val + '</button>';
    }
    return eDiv;
  }

  OnCellClicked(data) {
    let updateVlue = {
      "Client_Id": data.data.Client_Id,
      "Client_Instruction_Id": data.data.Id
    }
    let actionType = data.event.target.getAttribute("data-action-type")
    if (data.colDef.headerName == "Action" && actionType == "update") {
      this.service.UpdateClientInstruction(updateVlue).subscribe(res => {
        this.ResponseHelper.GetSuccessResponse(res)
        this.ClientUpdateData = res.json().Data;
        this.CloseModal.emit('count');
      }, err => {
        this.ResponseHelper.GetFaliureResponse(err);

      })
    }
  }

  Close() {
    this.CloseModal.emit();
  }

}
