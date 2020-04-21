import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common-service';
import { Token } from 'src/app/manager/token';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { SupervisorAgentService } from 'src/app/service/supervisor-agent.service';
import { GlobalInsuranceService } from 'src/app/service/global-insurance.service';
import { finalize } from 'rxjs/operators';
import { SaagService } from 'src/app/service/client-configuration/saag.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DropdownService } from 'src/app/service/client-configuration/dropdown.service';
import { AgentService } from 'src/app/service/agent.service';
import { dropDownFields } from 'src/app/manager/dropdown-feilds';

@Component({
	selector: 'app-supervisor-agent',
	templateUrl: './supervisor-agent.component.html',
	styleUrls: ['./supervisor-agent.component.css'],
	providers: [dropDownFields]
})
export class SupervisorAgentComponent implements OnInit {
	Title = 'Supervisor Agent';
	UserId;
	ClientList = [];
	StandardFieldList = [];
	AllFields = [];
	SelectedStandardField = '';
	SelectedStandardValue = '';
	StandardValue = '';
	ClientId = 0;
	InventoryLogId = 0;
	InsurancePayerName = '';
	InsuranceData = {};
	Status = '';
	SubStatus = '';
	ActionCode = '';
	Notes = '';
	WorkStatus = '';
	StatusList = [];
	SubStatusList = [];
	ActionCodeList = [];
	SaagLookup = [];
	ActionForm: FormGroup;
	Validated = false;
	DisplayFields = false;
	EnableSearch = false;
	OpenNotesGenerator = false;
	OpenInsuranceMaster = false;
	OpenLogsPopup = false;
	StandardLogs = [];
	ResponseHelper: ResponseHelper;
	PopupHeaders = [];
	MinDate: Date;
	InstructionCount = 0;
	ClientUpdateData = [];
	DisplayClientUpdate = false;
	ShowBellIcon = false;
	DisableSubmit = false;
	constructor(
		private router: Router,
		private dropDownFields: dropDownFields,
		private notificationservice: NotificationService,
		private service: SupervisorAgentService,
		private agentservice: AgentService,
		private dropdownservice: DropdownService,
		private globalservice: GlobalInsuranceService,
		private saagservice: SaagService,
		private fb: FormBuilder
	) { }

	ngOnInit() {
		let token = new Token(this.router);
		var userdata = token.GetUserData();
		this.UserId = userdata.UserId;
		this.ResponseHelper = new ResponseHelper(this.notificationservice);
		//this.GetClientList();
		this.CreateActionForm();
		this.ClientList = this.dropDownFields.setSelected(userdata.Clients);
		if (this.ClientList[0].selected) {
			this.ClientId = this.ClientList[0].Client_Id
			this.GetStandardFieldsList()
		}
		// this.selectedValue(this.ClientList)
		// this.ActionForm.addControl('ActionForm'))
		this.ActionForm.addControl('standerdField', new FormControl(''))


		this.MinDate = new Date('01/01/1974');
		sessionStorage.removeItem("WorkingLog");
	}

	selectedValue(data) {

		if (data.length == 1 && data.length) {
			data[0].selected = true;
			this.ClientId = data[0].Client_Id
			this.GetStandardFieldsList()
		} else {
		}

	}

	GetInstructionCount() {
		this.service.GetInstructionCount(this.ClientId).subscribe(res => {
			this.ShowBellIcon = true;
			this.InstructionCount = res.json().Data;
		}, err => {
			this.InstructionCount = 0;
			this.ResponseHelper.GetFaliureResponse(err);
		})
	}

	GetClientInstructions() {
		this.service.getClientUpdate(this.ClientId).pipe(finalize(() => {
		})).subscribe(res => {
			this.ClientUpdateData = res.json().Data;
			this.ToggleClientModal(null);
		}, err => {
			this.ResponseHelper.GetFaliureResponse(err);
		})
	}

	ToggleClientModal(event) {
		if (!event) {
			this.DisplayClientUpdate = !this.DisplayClientUpdate;
			return
		}
		else if (event == 'count') {
			this.GetInstructionCount();
		}

	}

	CreateActionForm() {
		this.ActionForm = this.fb.group({
			Status: ['', Validators.required],
			SubStatus: ['', Validators.required],
			ActionCode: ['', Validators.required],
			WorkStatus: ['', Validators.required],
			Notes: ['', Validators.required],
			standerdField: [''],
			client: []


		});
	}

	GetClientList() {
		// this.selectedValue(this.ClientList)
		// this.commonservice.GetClientList(this.UserId).subscribe(
		// 	(data) => {
		// 		
		// 		this.ClientList = data.json().Data;
		// 		this.selectedValue(this.ClientList)
		// 	},
		// 	(err) => {
		// 		this.ResponseHelper.GetFaliureResponse(err);
		// 	}
		// );
	}

	ClientListOnChange(event) {
		this.StandardValue = '';
		this.StandardFieldList = [];
		if (!event.target.value || event.target.value == '0') {
			// this.DisableClientList = true;
			this.EnableSearch = false;
			this.ShowBellIcon = false;
			this.SelectedStandardField = '';
			this.StandardFieldList = [];
		} else {
			this.ClientId = event.target.value;
			this.SelectedStandardField = '';

			this.GetStandardFieldsList();
			// this.GetInventoryLog();
		}
	}

	GetStandardFieldsList() {
		this.service.GetStandardFields(this.ClientId).subscribe(
			(data) => {
				// this.StandardFieldList = data.json().Data;
				this.StandardFieldList = this.dropDownFields.setSelected(data.json().Data)
				this.GetSaagLookup();
			},
			(err) => {
				this.StandardFieldList = [];
				this.EnableSearch = false;
				this.ResponseHelper.GetFaliureResponse(err);
			}
		);
	}

	StandardFieldOnChange(event) {
		if (!event.target.value || event.target.value == '') {
			this.EnableSearch = false;
			this.SelectedStandardField = '';
		}
		this.StandardFieldList.forEach(e => {
			if (e.Header_Name == this.SelectedStandardField) {
				this.SelectedStandardValue = e.Display_Name
			}
		})
		//  else {
		// 	this.EnableSearch = true;
		// }
	}

	OnStandardValueChange() {
		this.EnableSearch = false;
		if (this.ClientId != 0 && this.SelectedStandardField != '' && this.StandardValue != '') {
			this.EnableSearch = true;
		}
	}

	GetAccounts() {
		this.ShowBellIcon = false;
		this.GetInstructionCount();
		var formobj = {
			Client_Id: this.ClientId,
			Display_Name: this.SelectedStandardValue,
			Header_Name: this.SelectedStandardField,
			Field_Value: this.StandardValue
		};
		this.EnableSearch = false;
		this.service.GetLogPopup(formobj).pipe(finalize(() => {
			this.EnableSearch = true;
		})).subscribe(
			(data) => {
				
				this.StandardLogs = data.json().Data;
				this.ToggleLogsPopup(true);

			},
			(err) => {
				this.ResponseHelper.GetFaliureResponse(err);
			}
		);
	}

	GetInventoryLog(InventoryLogId) {

		this.service.GetInventoryLog(this.ClientId, this.InventoryLogId, InventoryLogId).subscribe(
			(data) => {
				this.InventoryLogId = InventoryLogId;

				this.AllFields = data.json().Data;
				this.ManageNullFields();
				this.ManageActionForm();

				this.DisplayFields = true;
				this.OpenLogsPopup = false;
			},
			(err) => {
				this.ResponseHelper.GetFaliureResponse(err);
			}
		);
	}

	ManageNullFields() {
		this.AllFields.forEach(e => {
			if (e.Is_Standard_Field) {
				switch (e.Column_Datatype) {
					case "Text":
						// if (e.FieldValue == null) {
						//   e.FieldValue = "NA"
						// }
						if (e.Display_Name.indexOf('Payer') != -1) {
							this.InsurancePayerName = e.FieldValue;
						}
						break;
					case "Date":
						if (e.FieldValue != null) {
							var d = new Date(e.FieldValue);
							e.FieldValue = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
						}
						// else {
						//   e.FieldValue = "NA"
						// }
						break;
				}
			}
			else {
				switch (e.Column_Datatype) {
					case "Text":
						// if (e.FieldValue == null || e.FieldValue == "") {
						//   e.FieldValue = "NA"
						// }
						if (e.Is_Dropdown_Field && e.Is_View_Allowed_Agent && e.Is_Edit_Allowed_Agent) {
							var dropdownlist = [];
							this.dropdownservice.getDropdownValue(this.ClientId, e.Id).subscribe(
								res => {
									dropdownlist = res.json().Data;
									e.DropdownList = dropdownlist
								},
								err => {
									this.ResponseHelper.GetFaliureResponse(err);
								}
							)
						}
						break;

					case "Date":
						if (!e.Is_Edit_Allowed_Agent && e.Is_View_Allowed_Agent) {
							if (e.FieldValue != null) {
								var d = new Date(e.FieldValue);
								e.FieldValue = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
							}
							// else {
							//   e.FieldValue = "NA";
							// }

						}
						break;
				}
			}
		})
	}

	ManageActionForm() {
		this.AllFields.forEach((e) => {
			switch (e.Header_Name) {
				case 'Id':
					this.InventoryLogId = e.FieldValue;
					sessionStorage.setItem("WorkingLog", JSON.stringify({ Client_Id: this.ClientId, Inventory_Log_Id: e.FieldValue }));
					break;
				case 'Status':
					this.ActionForm.patchValue({ Status: e.FieldValue });
					break;
				case 'Sub_Status':
					var substatus = [];
					this.SaagLookup.forEach((e) => {
						if (e.Status == this.ActionForm.get('Status').value) {
							substatus.push(e.Sub_Status);
						}
					});

					this.SubStatusList = substatus.filter(function (item, pos) {
						return substatus.indexOf(item) == pos;
					});
					this.ActionForm.patchValue({ SubStatus: e.FieldValue });
					break;
				case 'Action_Code':
					let actionCode = [];
					this.SaagLookup.forEach((e) => {
						if (
							e.Sub_Status == this.ActionForm.get('SubStatus').value &&
							e.Status == this.ActionForm.get('Status').value
						) {
							actionCode.push(e.Action_Code);
						}
					});

					this.ActionCodeList = actionCode.filter(function (item, pos) {
						return actionCode.indexOf(item) == pos;
					});
					this.ActionForm.patchValue({ ActionCode: e.FieldValue });
					break;
				case 'Account_Status':
					this.ActionForm.patchValue({ WorkStatus: e.FieldValue });
					break;
				case 'Notes':
					this.ActionForm.patchValue({ Notes: e.FieldValue });
					break;
			}
		});
	}

	ClearForm() {
		this.Validated = false;
		this.CreateActionForm();
	}

	BlockInput(event) {
		if (event.keyCode == 'backspace') event.preventDefault();
		return false;
	}

	ToggleLogsPopup(event) {
		this.OpenLogsPopup = !this.OpenLogsPopup;
	}

	ToggleNotesGenerator(event) {
		if (event != null && event != false) {
			this.ActionForm.patchValue({ Notes: event });
		}
		this.OpenNotesGenerator = !this.OpenNotesGenerator;
	}

	ToggleInsuranceMaster() {
		if (!this.OpenInsuranceMaster) {
			this.GetInsuranceMaster();
		} else {
			this.OpenInsuranceMaster = !this.OpenInsuranceMaster;
		}
	}
	GetInsuranceMaster() {
		let formdata = { Client_Id: this.ClientId, Payer_Name: this.InsurancePayerName };
		this.globalservice.GetInsuranceMaster(formdata).pipe(finalize(() => { })).subscribe(
			(res) => {
				this.InsuranceData = res.json().Data;
				this.OpenInsuranceMaster = !this.OpenInsuranceMaster;
			},
			(err) => {
				this.ResponseHelper.GetFaliureResponse(err);
			}
		);
	}

	GetSaagLookup() {
		this.StatusList = [];
		
		this.saagservice.getSaagLookup(this.ClientId).subscribe(
			(data) => {
				
				this.SaagLookup = data.json().Data.SAAG_Lookup;
				let status = this.SaagLookup.map(function (obj) {
					return obj.Status;
				});
				this.StatusList = status.filter(function (item, pos) {
					return status.indexOf(item) == pos;
				});
				let substatus = this.SaagLookup.map(function (obj) {
					return obj.Sub_Status;
				});
				this.SubStatusList = substatus.filter(function (item, pos) {
					return substatus.indexOf(item) == pos;
				});

				let action = this.SaagLookup.map(function (obj) {
					return obj.Action_Code;
				});
				this.ActionCodeList = action.filter(function (item, pos) {
					return action.indexOf(item) == pos;
				});
			},
			(err) => {
				this.ResponseHelper.GetFaliureResponse(err);
			}
		);
	}

	OnStatusChange(event) {
		
		this.ActionForm.patchValue({ "SubStatus": ""});
		this.ActionForm.patchValue({ "ActionCode": ""})
		this.SubStatusList = [];
		let substatus = [];
		this.SaagLookup.forEach((e) => {
			if (e.Status == event.target.value) {
				substatus.push(e.Sub_Status);
			}
		});

		this.SubStatusList = substatus.filter(function (item, pos) {
			return substatus.indexOf(item) == pos;
		});
		if (this.SubStatusList.length == 1) {
			
			this.ActionForm.patchValue({ "SubStatus": this.SubStatusList[0] })
			this.OnSubStatusChange(this.SubStatusList[0])
		}
	}

	OnSubStatusChange(event) {
		this.ActionForm.patchValue({ "ActionCode": ""})
		this.ActionCodeList = [];
		let actionCode = [];
		if (!event.target) {
			this.SaagLookup.forEach((e) => {
				if (e.Sub_Status == event && e.Status == this.ActionForm.get('Status').value) {
					actionCode.push(e.Action_Code);
				}
			});
		} else {
			this.SaagLookup.forEach((e) => {
				if (e.Sub_Status == event.target.value && e.Status == this.ActionForm.get('Status').value) {
					actionCode.push(e.Action_Code);
				}
			});
		}

		this.ActionCodeList = actionCode.filter(function (item, pos) {
			return actionCode.indexOf(item) == pos;
		});
		if (this.ActionCodeList.length == 1) {
			this.ActionForm.patchValue({ "ActionCode": this.ActionCodeList[0] })
		}

	}

	SubmitForm() {
		
		this.Validated = true;
		if (this.ActionForm.valid) {
			var objs = new Object();
			objs['Client_Id'] = this.ClientId;
			// objs['Inventory_Log_Id'] = this.InventoryLogId;
			this.AllFields.forEach((e) => {
				if (e.Header_Name == 'Notes') {
					e.FieldValue = this.ActionForm.controls['Notes'].value;
				}
				objs[e.Header_Name] = e.FieldValue;
			});
			objs['Status'] = this.ActionForm.controls['Status'].value;
			objs['Sub-Status'] = this.ActionForm.controls['SubStatus'].value;
			objs['Action_Code'] = this.ActionForm.controls['ActionCode'].value;
			objs['Account_Status'] = this.ActionForm.controls['WorkStatus'].value;

			var obj = new Object();
			obj['Fields'] = objs;
			this.DisableSubmit = true;
			this.service.SaveAllFields(obj).pipe(finalize(() => {
				this.DisableSubmit = false;
			})).subscribe(
				(res) => {
					this.ClearForm();
					this.ResponseHelper.GetSuccessResponse(res);
					this.InventoryLogId = 0;
					this.AllFields = [];
					this.EnableSearch = false;
					this.StandardValue = '';
					this.DisplayFields = false;
				},
				(err) => {
					this.ResponseHelper.GetFaliureResponse(err);
				}
			);
		}
	}

	EndCurrentAccount() {
		if (this.InventoryLogId != 0) {
			var formobj = {
				Client_Id: this.ClientId,
				Inventory_Log_Id: this.InventoryLogId
			}
			this.agentservice.InsertEndTimeOfInventory(formobj).subscribe(
				res => {

				},
				err => {
					this.ResponseHelper.GetFaliureResponse(err);
				}
			);
		}
	}

	@HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
		// event.returnValue = false;
		this.EndCurrentAccount();
	}
}
