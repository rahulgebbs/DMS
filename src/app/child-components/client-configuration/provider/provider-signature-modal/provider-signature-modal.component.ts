import { Component, OnInit ,Output,EventEmitter,Input} from '@angular/core';
import { ProviderService } from '../../../../service/client-configuration/provider.service'
import { Token } from '../../../../manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';

@Component({
  selector: 'app-provider-signature-modal',
  templateUrl: './provider-signature-modal.component.html',
  styleUrls: ['./provider-signature-modal.component.css']
})
export class ProviderSignatureModalComponent implements OnInit {
  @Output() Toggle = new EventEmitter<any>();
  @Input() SelectedProvider;
  showPopup:boolean=false;
  File;
  FileBase64;
  Filename = 'No File Chosen';

  token;
  userData;
  uploadBtnDisable: boolean = true;
  ResponseHelper:ResponseHelper;

  constructor( private router: Router,private service: ProviderService, private notificationService: NotificationService) {
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();
    this.ResponseHelper = new ResponseHelper(this.notificationService);

   }

  ngOnInit() {
   // console.log("data1",this.SelectedProvider);
  }

  closeModel() {

    this.Toggle.emit(this.showPopup);
    
   
  }

OnChange(event): void {
    ;
    if (event.target.files && event.target.files.length > 0) {      
      this.File = event.target.files[0];
      this.Filename = this.File.name;        
      this.ConvertToBase64();
    
    }
    else {     

      this.File = null;
      this.FileBase64 = null;
      

    }
  }

  ConvertToBase64() {
    let reader = new FileReader();
    reader.readAsDataURL(this.File);
    reader.onload = () => {    
      this.FileBase64 = reader.result.toString().split(',')[1]; 
     

    }   
    this.uploadBtnDisable = false ;
  }


  
  uploadSignature() {
    
    var dataobj = new Object();
     if (this.FileBase64) {
       dataobj = {
        
          File: this.FileBase64,
          File_Name: this.Filename,
          Id:this.SelectedProvider.Id,
          Client_Id :this.SelectedProvider.Client_Id
      };
      this.service.UploadProviderSignature(this.userData.TokenValue, dataobj).subscribe(data => {
   debugger
        this.uploadBtnDisable = true;       

        this.Filename = 'No File Chosen';
        this.File = [];
        this.FileBase64 = null;
        this.closeModel();
        this.ResponseHelper.GetSuccessResponse(data);
        
       
       
      },
        err => {
          this.ResponseHelper.GetFaliureResponse(err)
        }
      );

    }
  }


}
