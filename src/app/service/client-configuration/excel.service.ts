import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})

export class ExcelService {
  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    
    var json_string=JSON.stringify(json)
    var converted=JSON.parse(json_string, (k, v) => v === true ? "Yes" : v === false ? "No" : v);

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(converted);
    const workbook: XLSX.WorkBook = { Sheets: { 'sheet 1': worksheet }, SheetNames: ['sheet 1'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    let name = fileName + '_iAR_' + new Date().getTime() + EXCEL_EXTENSION;
    FileSaver.saveAs(data, name);
  }

  public downloadExcel(res) {
    let url = window.URL.createObjectURL(res.data);
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = res.filename;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}