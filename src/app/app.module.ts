import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './landing-page/login/login.component';
import { ForgotPasswordComponent } from './landing-page/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './landing-page/change-password/change-password.component';
import { MenuComponent } from './common-components/menu/menu.component';
import { HeaderComponent } from './common-components/header/header.component';
import { FooterComponent } from './common-components/footer/footer.component';
import { NotificationComponent } from './common-components/notification/notification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NotificationService } from './service/notification.service';
import { AgGridModule } from 'ag-grid-angular';
import { AuthGuard } from './auth.guard';

import { CommonService } from './service/common-service';

import { UploadFileComponent } from './landing-page//upload-file/upload-file.component';
import { ViewFileComponent } from './landing-page//view-file/view-file.component';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { LoadingPageComponent } from './common-components/loading-page/loading-page.component';
import { MultipleTabComponent } from './common-components/multiple-tab/multiple-tab.component';
import { HttpClientModule } from '@angular/common/http';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';



import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module


import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ViewDocumentComponent } from './landing-page/view-document/view-document.component';
import { NotFoundComponent } from './landing-page/not-found/not-found.component';
import { ReadCountModalComponent } from './landing-page/read-count-modal/read-count-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    NotFoundComponent,
    ViewDocumentComponent,
    MenuComponent,
    HeaderComponent,
    FooterComponent,
    NotificationComponent,
    UploadFileComponent,
    ViewFileComponent,
    LoadingPageComponent,
    MultipleTabComponent,
    ReadCountModalComponent,
  ],
  imports: [
    // PdfViewerModule,
    NgxExtendedPdfViewerModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    OwlDateTimeModule,
    BrowserAnimationsModule,
    OwlNativeDateTimeModule,
    NgbModule,
    AgGridModule.withComponents([]),
    RouterModule.forRoot([
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      // { path: 'two-factor-auth', component: TwoFactorAuthComponent },

      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard], data: { route: ['change-password'] } },
      { path: 'refernce-document-supervisor', component: UploadFileComponent, canActivate: [AuthGuard], data: { route: ['refernce-document-supervisor'] } },
      { path: 'view-file', component: ViewFileComponent, canActivate: [AuthGuard], data: { route: ['view-file'] } },
      { path: 'document-view/:Id/:Client_Id/:filename/:referencefile', component: ViewDocumentComponent, canActivate: [AuthGuard], data: { route: ['document-view'] } },
      { path: 'multiple-tab', component: MultipleTabComponent },
      { path: '**', component: NotFoundComponent }

    ]),
    NgMultiSelectDropDownModule.forRoot(),
    HttpClientModule
  ],
  providers: [NotificationService, CommonService],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
//