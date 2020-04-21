import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
	selector: 'app-log-popup',
	templateUrl: './log-popup.component.html',
	styleUrls: ['./log-popup.component.css']
})
export class LogPopupComponent implements OnInit {
	@Input() StandardLogs;
	@Output() CloseLogPopup = new EventEmitter<any>();
	@Output() SendLogId = new EventEmitter<any>();
	@Input() SelectedLogId;
	ColumnDefs = []

	constructor() { }

	ngOnInit() {
		var headers = Object.keys(this.StandardLogs[0]).map((key) => key);

		headers.forEach((e: string) => {
			if (e == 'Id' || e == 'Inventory_Id') {
				this.ColumnDefs.push({ headerName: e.split("_").join(" "), field: e, hide: true, rowGroupIndex: null })
			}
			else {
				this.ColumnDefs.push({ headerName: e.split("_").join(" "), field: e })
			}

		});
	}

	OnRowClick(event) {
		this.SelectedLogId = event.data.Id;
		this.SendLogId.emit(this.SelectedLogId);
	}

	Close() {
		this.CloseLogPopup.emit(false);
	}

	AutoSizeGrid(event) {
		if (this.StandardLogs != null) {
			var allColumnIds = [];
			event.columnApi.getAllColumns().forEach(function (column) {
				allColumnIds.push(column.colId);
			});
			event.columnApi.autoSizeColumns(allColumnIds);
		}
	}
}
