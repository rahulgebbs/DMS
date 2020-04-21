import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { AppealService } from 'src/app/service/client-configuration/appeal.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-appeal',
  templateUrl: './appeal.component.html',
  styleUrls: ['./appeal.component.css']
})
export class AppealComponent implements OnInit {

  @Input() ClientData;
  @Output() next_page = new EventEmitter<any>();
  ResponseHelper: ResponseHelper;
  UserId = 0;
  ClientId = 0;
  Placeholders: any;
  Headers = [];
  ShowMain = false;
  AppealForm: FormGroup;
  PlaceholderList: FormArray;
  TemplateNameList = [];
  DisableSubmit = false;
  showLoading:boolean=true;

  constructor(private service: AppealService, private notificationservice: NotificationService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    this.ClientId = this.ClientData.Id;
    this.CreateForm();
    this.GetAllPlaceholders();
    this.GetTableHeaders();
  }

  CreateForm() {
    this.AppealForm = this.formBuilder.group({
      // ... other controls
      Cover_Letter: this.formBuilder.array([]),
      Fax_Cover_Letter: this.formBuilder.array([]),
      Generic_Appeal_Letter: this.formBuilder.array([]),
      Redetermination: this.formBuilder.array([]),
      Reconsideration: this.formBuilder.array([]),
      Insurance_Specific_Appeal_Letter: this.formBuilder.array([])
      //
      //Template_Name: this.formBuilder.control('', Validators.required),
      // Placeholder_Name: this.formBuilder.control('', Validators.required),
      // Table_Name: this.formBuilder.control('', Validators.required),
      // Column_Name: this.formBuilder.control('', Validators.required)
      // })
      // })
    });
  }

  CreateArray(templateId: number, templatename: string, placeholdername: string, tablename: string, columnname: string) {
    return this.formBuilder.group({
      Template_Id: templateId,
      Template_Name: templatename,
      Placeholder_Name: placeholdername,
      Table_Name: tablename,
      Column_Name: columnname
    });
  }

  addItem(): void {
    Object.keys(this.Placeholders).forEach(pkey => {
      Object.keys(this.AppealForm.controls).forEach(key => {
        if (pkey == key) {
          this.Placeholders[pkey].forEach(e => {
            var aa = this.AppealForm.get(key) as FormArray
            aa.push(this.CreateArray(e.Id, e.Template_Name, e.Placeholder_Name, e.Table_Name, e.Column_Name));
          });

        }
      });
    })


    // var flist = this.AppealForm.get('FaxCoverLetter') as FormArray;
    // flist.push(this.CreateArray('a', 'b', 'c', 'd'));
  }

  GetTableHeaders() {
    this.service.GetTableHeaders(this.ClientId).subscribe(
      res => {
        this.Headers = res.json().Data.Table_Infos;
        this.Headers.forEach(e => {
          //--------------------Insurance--------------------
          e.Display_Name = '--------------------' + e.Table_Name.toUpperCase() + '--------------------';
        });
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err)
      }
    )
  }

  GetAllPlaceholders() {
    this.service.GetAllPlaceholders(this.ClientId).subscribe(
      res => {
        this.showLoading=false;
        var cars = res.json().Data;
        var result = cars.reduce(function (r, a) {
          r[a.Template_Name] = r[a.Template_Name] || [];
          r[a.Template_Name].push(a);
          return r;
        }, Object.create(null));
        this.Placeholders = result;
        this.addItem();
        Object.keys(this.Placeholders).forEach(pkey => {
          this.TemplateNameList.push(pkey);
        });
        this.ShowMain = true;
      },
      err => {
        this.showLoading=false;
        this.ResponseHelper.GetFaliureResponse(err)
      }
    )
  }

  OnCoverLetterChange(event, p) {
    var tablename = event.target.options[event.target.selectedIndex].parentNode.id;
    var arr = (this.AppealForm.get(p.Template_Name) as FormArray)

    for (let i = 0; i < arr.length; i++) {
      if (arr.at(i).get('Template_Id').value == p.Id) {
        arr.at(i).patchValue({ Table_Name: tablename });
      }
    }

  }

  SubmitForm() {
    this.DisableSubmit = true;
    this.service.InsertPlaceholderMapping(this.AppealForm.value, this.ClientData.Id).pipe(finalize(() => {
      this.DisableSubmit = false;
    })).subscribe(
      res => {
        this.ResponseHelper.GetSuccessResponse(res);
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      })
  }

  navigate() {
    this.next_page.emit('appeal');
  }

}
