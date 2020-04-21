import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './landing-page/login/login.component';
import { ForgotPasswordComponent } from './landing-page/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './landing-page/change-password/change-password.component';
import { UserManagementComponent } from './landing-page/user-management/user-management.component';
import { ClientConfigurationComponent } from './landing-page/client-configuration/client-configuration.component';
import { MenuComponent } from './common-components/menu/menu.component';
import { HeaderComponent } from './common-components/header/header.component';
import { FooterComponent } from './common-components/footer/footer.component';
import { NotificationComponent } from './common-components/notification/notification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NotificationService } from './service/notification.service';
import { NotFoundComponent } from './landing-page/not-found/not-found.component';
import { BucketMappingComponent } from './landing-page/bucket-mapping/bucket-mapping.component';
import { AgGridModule } from 'ag-grid-angular';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './landing-page/dashboard/dashboard.component';

import { GlobalInsuranceComponent } from './landing-page/global-insurance/global-insurance.component';
import { GlobalMappingComponent } from './landing-page/global-mapping/global-mapping.component';
import { CommonService } from './service/common-service';
import { MappingModalComponent } from './landing-page/global-mapping/mapping-modal/mapping-modal.component';
import { ClientComponent } from './child-components/client-configuration/client/client.component';
import { SaagComponent } from './child-components/client-configuration/saag/saag.component';
import { InsuranceComponent } from './child-components/client-configuration/insurance/insurance.component';
import { ProviderComponent } from './child-components/client-configuration/provider/provider.component';
import { InventoryComponent } from './child-components/client-configuration/inventory/inventory.component';
import { DropdownComponent } from './child-components/client-configuration/dropdown/dropdown.component';
import { FormulaComponent } from './child-components/client-configuration/formula/formula.component';
import { InventoryModalComponent } from './child-components/client-configuration/inventory/inventory-modal/inventory-modal.component';
import { UploadFileComponent } from './landing-page//upload-file/upload-file.component';
import { ViewFileComponent } from './landing-page//view-file/view-file.component';
import { AutoAllocationComponent } from './landing-page/auto-allocation/auto-allocation.component';
import { ClientInstructionComponent, InstructionModel } from './landing-page/client-instruction/client-instruction.component';
import { DataUploadComponent } from './landing-page/data-upload/data-upload.component';
import { EditGlobalModalComponent } from './landing-page/global-insurance/edit-global-modal/edit-global-modal.component';
import { SimpleReportComponent } from './landing-page/simple-report/simple-report.component';
import { EmployeeSelectorModalComponent } from './landing-page/simple-report/employee-selector-modal/employee-selector-modal.component';
import { MisReportComponent } from './landing-page/mis-report/mis-report.component';
import { InsuranceModalComponent } from './child-components/client-configuration/insurance/insurance-modal/insurance-modal.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DeAllocationComponent } from './landing-page/de-allocation/de-allocation.component';
import { DropdownModalComponent } from './child-components/client-configuration/dropdown/dropdown-modal/dropdown-modal.component';
import { FormulaModalComponent } from './child-components/client-configuration/formula/formula-modal/formula-modal.component';
import { AgentComponent } from './landing-page/agent/agent.component';
import { NotesGeneratorComponent } from './child-components/agent/notes-generator/notes-generator.component';
import { InsuranceMasterComponent } from './child-components/agent/insurance-master/insurance-master.component';
import { SaagPopupComponent } from './child-components/agent/saag-popup/saag-popup.component';
import { ClientUpdateComponent } from './child-components/agent/client-update/client-update.component';
import { INotepadComponent } from './child-components/agent/i-notepad/i-notepad.component';
import { MystatsComponent } from './child-components/agent/mystats/mystats.component';
import { BreakPopupComponent } from './child-components/agent/break-popup/break-popup.component';
import { SupervisorAgentComponent } from './landing-page/supervisor-agent/supervisor-agent.component';
import { AccountsModalComponent } from './child-components/agent/accounts-modal/accounts-modal.component';
import { LogPopupComponent } from './child-components/supervisor-agent/log-popup/log-popup.component';
import { CountModelComponent } from './landing-page/client-instruction/count-model/count-model.component';
import { DenialCodeComponent } from './landing-page/denial-code/denial-code.component';
import { DenialCodeModalComponent } from './landing-page/denial-code/denial-code-modal/denial-code-modal.component';
import { SupervisorDashboardComponent } from './landing-page/supervisor-dashboard/supervisor-dashboard.component';
import { SupervisorDashboardModalComponent } from './landing-page/supervisor-dashboard/supervisor-dashboard-modal/supervisor-dashboard-modal.component';
import { ImeditComponent } from './landing-page/supervisor-dashboard/imedit/imedit.component';
import { ClientInstructionsModalComponent } from './child-components/supervisor-agent/client-instructions-modal/client-instructions-modal.component';
import { AppealComponent } from './child-components/client-configuration/appeal/appeal.component';
import { ProviderSignatureModalComponent } from './child-components/client-configuration/provider/provider-signature-modal/provider-signature-modal.component';
import { SettingTemplateModalComponent } from './child-components/client-configuration/insurance/setting-template-modal/setting-template-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppealModalComponent } from './child-components/agent/appeal-modal/appeal-modal.component';
import { PdfViewerComponent } from './common-components/pdf-viewer/pdf-viewer.component';
import { StandardCommentComponent } from './landing-page/standard-comment/standard-comment.component';
import { AgentCorrespodanceComponent } from './landing-page/agent-correspodance/agent-correspodance.component';
import { AccountListModalComponent } from './child-components/agent-correspondance/account-list-modal/account-list-modal.component';
import { CorrespondanceNotesGeneratorModalComponent } from './child-components/agent-correspondance/correspondance-notes-generator-modal/correspondance-notes-generator-modal.component';
import { CorrespondanceInsuranceMasterModalComponent } from './child-components/agent-correspondance/correspondance-insurance-master-modal/correspondance-insurance-master-modal.component';
import { ExceptionEntryComponent } from './landing-page/exception-entry/exception-entry.component';
import { ProviderModelComponent } from './child-components/client-configuration/provider/provider-model/provider-model.component';
import { ClientAssistanceComponent } from './landing-page/client-assistance/client-assistance.component';
import { AssistanceModalComponent } from './landing-page/client-assistance/assistance-modal/assistance-modal.component';
import { ClientApprovalComponent } from './landing-page/client-approval/client-approval.component';
import { ApprovalModalComponent } from './landing-page/client-approval/approval-modal/approval-modal.component';
import { ClientInstructionReportComponent } from './landing-page/client-instruction-report/client-instruction-report.component';
import { ClientDashboardReportComponent } from './landing-page/client-dashboard-report/client-dashboard-report.component';
import { CommentHistoryModalComponent } from './landing-page/client-approval/comment-history-modal/comment-history-modal.component';
import { ClientUserComponent } from './landing-page/client-user/client-user.component';
import { ClientUserApprovalModalComponent } from './landing-page/client-user/client-user-approval-modal/client-user-approval-modal.component';
import { LoadingPageComponent } from './common-components/loading-page/loading-page.component';
import { MultipleTabComponent } from './common-components/multiple-tab/multiple-tab.component';
import { TlDenyReportComponent } from './landing-page/tl-deny-report/tl-deny-report.component';

import { ClientDashboardModalComponent } from './landing-page/client-dashboard-report/client-dashboard-modal/client-dashboard-modal.component';
import { AgeingDashboardReportComponent } from './landing-page/ageing-dashboard-report/ageing-dashboard-report.component';
import { KyireportComponent } from './landing-page/KYI/kyireport/kyireport.component';
import { FlashdashboardReportComponent } from './landing-page/flashdashboard-report/flashdashboard-report.component';
import { PaymentReportComponent } from './landing-page/payment-report/payment-report.component';
import { DenialCodePopupComponent } from './child-components/agent/denial-code-popup/denial-code-popup.component';
import { HttpClientModule } from '@angular/common/http';
import { BcbPopupComponent } from './child-components/agent/bcb-popup/bcb-popup.component';
import { BcbsDataUploadComponent } from './landing-page/bcbs-data-upload/bcbs-data-upload.component';
import { UnworkedAccountsReportComponent } from './landing-page/unworked-accounts-report/unworked-accounts-report.component';
import { ProductionReportComponent } from './landing-page/production-report/production-report.component';
import { ProductionEmployeeSelectorModalComponent } from './landing-page/production-report/production-employee-selector-modal/production-employee-selector-modal.component';
import { CitraAuditComponent } from './landing-page/citra-audit/citra-audit.component';
import { CitraAccountsModalComponent } from './child-components/citra-accounts-modal/citra-accounts-modal.component';
import { CitraEmployeeMappingComponent } from './landing-page/citra-employee-mapping/citra-employee-mapping.component';
import { CitraAuditReportComponent } from './landing-page/citra-audit-report/citra-audit-report.component';
import { AgentDeallocationComponent } from './landing-page/agent-deallocation/agent-deallocation.component';
import { ByAgentDeallocationModalComponent } from './child-components/deallocation/by-agent-deallocation-modal/by-agent-deallocation-modal.component';
import { ByBucketDeallocationModalComponent } from './child-components/deallocation/by-bucket-deallocation-modal/by-bucket-deallocation-modal.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { BiReportsComponent } from './landing-page/bi-reports/bi-reports.component';
/* productivity report*/
import { ProductivityReportComponent } from './child-components/report/productivity-report/productivity-report.component';
import { AgentProductivityReportComponent } from './child-components/report/agent-productivity-report/agent-productivity-report.component';



// client user mapping
import { ClientUserMappingComponent } from './child-components/client-user-mapping/client-user-mapping.component';
import { ClientUserMappingService } from './service/client-user-mapping.service';
import { ClientUserMappingManagementComponent } from './child-components/client-user-mapping-management/client-user-mapping-management.component';
import { AddClientUserMappingManagementComponent } from './child-components/client-user-mapping-management/add-client-user-mapping-management/add-client-user-mapping-management.component';
import { EditClientUserMappingManagementComponent } from './child-components/client-user-mapping-management/edit-client-user-mapping-management/edit-client-user-mapping-management.component';
import { DeleteClientUserMappingManagementComponent } from './child-components/client-user-mapping-management/delete-client-user-mapping-management/delete-client-user-mapping-management.component';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module

import { TwoFactorAuthComponent } from './landing-page/two-factor-auth/two-factor-auth.component';
import { UserMenuMappingComponent } from './child-components/user-menu-mapping/user-menu-mapping.component';
import { AssignMenuComponent } from './child-components/assign-menu/assign-menu.component';
import { InventoryHighPriorityComponent } from './child-components/agent/inventory-high-priority/inventory-high-priority.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { CallReferenceComponent } from './child-components/agent/call-reference/call-reference.component';

import { CallReferenceInfoComponent } from './child-components/agent/call-reference-info/call-reference-info.component';
import { ConcluderReportComponent } from './concluder-report/concluder-report.component';
import { DeallocateConcluderComponent } from './deallocate-concluder/deallocate-concluder.component';
import { UploadMiniInsuranceComponent } from './upload-mini-insurance/upload-mini-insurance.component';
import { InventoryUploadComponent } from './inventory-upload/inventory-upload.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    BucketMappingComponent,
    UserManagementComponent,
    ClientConfigurationComponent,
    MenuComponent,
    HeaderComponent,
    FooterComponent,
    NotificationComponent,
    NotFoundComponent,
    BucketMappingComponent,
    DashboardComponent,
    GlobalInsuranceComponent,
    GlobalMappingComponent,
    MappingModalComponent,
    ClientComponent,
    SaagComponent,
    InsuranceComponent,
    ProviderComponent,
    InventoryComponent,
    DropdownComponent,
    FormulaComponent,
    InventoryModalComponent,
    UploadFileComponent,
    ViewFileComponent,
    AutoAllocationComponent,
    ClientInstructionComponent,
    DataUploadComponent,
    EditGlobalModalComponent,
    SimpleReportComponent,
    EmployeeSelectorModalComponent,
    MisReportComponent,
    InsuranceModalComponent,
    DropdownModalComponent,
    FormulaModalComponent,
    DeAllocationComponent,
    AgentComponent,
    NotesGeneratorComponent,
    InsuranceMasterComponent,
    SaagPopupComponent,
    ClientUpdateComponent,
    INotepadComponent,
    MystatsComponent,
    BreakPopupComponent,
    SupervisorAgentComponent,
    AccountsModalComponent,
    LogPopupComponent,
    CountModelComponent,
    DenialCodeComponent,
    DenialCodeModalComponent,
    SupervisorDashboardComponent,
    SupervisorDashboardModalComponent,
    ImeditComponent,
    ClientInstructionsModalComponent,
    AppealComponent,
    ProviderSignatureModalComponent,
    SettingTemplateModalComponent,
    AppealModalComponent,
    PdfViewerComponent,
    StandardCommentComponent,
    AgentCorrespodanceComponent,
    AccountListModalComponent,
    CorrespondanceNotesGeneratorModalComponent,
    CorrespondanceInsuranceMasterModalComponent,
    ExceptionEntryComponent,
    StandardCommentComponent,
    ProviderModelComponent,
    ClientAssistanceComponent,
    AssistanceModalComponent,
    ClientApprovalComponent,
    ApprovalModalComponent,
    ClientInstructionReportComponent,
    ClientDashboardReportComponent,
    CommentHistoryModalComponent,
    ClientUserComponent,
    ClientUserApprovalModalComponent,
    LoadingPageComponent,
    MultipleTabComponent,
    TlDenyReportComponent,
    ClientDashboardModalComponent,
    AgeingDashboardReportComponent,
    KyireportComponent,
    FlashdashboardReportComponent,
    PaymentReportComponent,
    DenialCodePopupComponent,
    BcbPopupComponent,
    BcbsDataUploadComponent,
    UnworkedAccountsReportComponent,
    ProductionReportComponent,
    ProductionEmployeeSelectorModalComponent,
    CitraAuditComponent,
    CitraAccountsModalComponent,
    CitraEmployeeMappingComponent,
    CitraAuditReportComponent,
    AgentDeallocationComponent,
    ByAgentDeallocationModalComponent,
    ByBucketDeallocationModalComponent,
    BiReportsComponent,
    ProductivityReportComponent,
    AgentProductivityReportComponent,
    ClientUserMappingComponent,
    ClientUserMappingManagementComponent,
    AddClientUserMappingManagementComponent,
    EditClientUserMappingManagementComponent,
    DeleteClientUserMappingManagementComponent,
    /*two-factor-auth*/
    TwoFactorAuthComponent,
    UserMenuMappingComponent,
    AssignMenuComponent,
    InventoryHighPriorityComponent,
    WelcomePageComponent,
    CallReferenceComponent,

    CallReferenceInfoComponent,

    ConcluderReportComponent,

    DeallocateConcluderComponent,

    UploadMiniInsuranceComponent,

    InventoryUploadComponent
  ],
  imports: [
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
      { path: 'two-factor-auth', component: TwoFactorAuthComponent },
      { path: 'welcome-page', component: WelcomePageComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard], data: { route: ['change-password'] } },
      { path: 'user-management', component: UserManagementComponent, canActivate: [AuthGuard], data: { route: ['user-management'] } },
      // { path: 'client-configuration', component: ClientConfigurationComponent },
      // { path: 'bucket-mapping', component: BucketMappingComponent },
      // { path: 'change-password', component: ChangePasswordComponent },
      // { path: 'user-management', component: UserManagementComponent },
      { path: 'client-configuration', component: ClientConfigurationComponent, canActivate: [AuthGuard], data: { route: ['client-configuration'] } },
      { path: 'bucket-mapping', component: BucketMappingComponent, canActivate: [AuthGuard], data: { route: ['bucket-mapping'] } },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { route: ['dashboard'] } },
      { path: 'global-insurance', component: GlobalInsuranceComponent, canActivate: [AuthGuard], data: { route: ['global-insurance'] } },
      { path: 'global-mapping', component: GlobalMappingComponent, canActivate: [AuthGuard], data: { route: ['global-mapping'] } },
      { path: 'upload-file', component: UploadFileComponent, canActivate: [AuthGuard], data: { route: ['upload-file'] } },
      { path: 'view-file', component: ViewFileComponent, canActivate: [AuthGuard], data: { route: ['view-file'] } },
      { path: 'auto-allocation', component: AutoAllocationComponent, canActivate: [AuthGuard], data: { route: ['auto-allocation'] } },
      { path: 'de-allocation', component: DeAllocationComponent, canActivate: [AuthGuard], data: { route: ['de-allocation'] } },
      { path: 'client-instruction', component: ClientInstructionComponent, canActivate: [AuthGuard], data: { route: ['client-instruction'] } },
      { path: 'data-upload', component: DataUploadComponent, canActivate: [AuthGuard], data: { route: ['data-upload'] } },
      { path: 'simple-report', component: SimpleReportComponent, canActivate: [AuthGuard], data: { route: ['simple-report'] } },
      { path: 'mis-report', component: MisReportComponent, canActivate: [AuthGuard], data: { route: ['mis-report'] } },
      { path: 'agent', component: AgentComponent, canActivate: [AuthGuard], data: { route: ['agent'] } },
      { path: 'supervisor-agent', component: SupervisorAgentComponent, canActivate: [AuthGuard], data: { route: ['supervisor-agent'] } },
      { path: 'denial-code', component: DenialCodeComponent, canActivate: [AuthGuard], data: { route: ['denial-code'] } },
      { path: 'supervisor-dashboard', component: SupervisorDashboardComponent, canActivate: [AuthGuard], data: { route: ['supervisor-dashboard'] } },
      { path: 'standard-comment', component: StandardCommentComponent, canActivate: [AuthGuard], data: { route: ['standard-comment'] } },
      { path: 'agent-correspondence', component: AgentCorrespodanceComponent, canActivate: [AuthGuard], data: { route: ['agent-correspondence'] } },
      { path: 'exception-entry', component: ExceptionEntryComponent, canActivate: [AuthGuard], data: { route: ['exception-entry'] } },
      { path: 'client-assistance', component: ClientAssistanceComponent, canActivate: [AuthGuard], data: { route: ['client-assistance'] } },
      { path: 'client-approval', component: ClientApprovalComponent, canActivate: [AuthGuard], data: { route: ['client-approval'] } },
      { path: 'client-instruction-report', component: ClientInstructionReportComponent, canActivate: [AuthGuard], data: { route: ['client-instruction-report'] } },
      { path: 'client-dashboard-report', component: ClientDashboardReportComponent, canActivate: [AuthGuard], data: { route: ['client-dashboard-report'] } },
      { path: 'ageing-dashboard-report', component: AgeingDashboardReportComponent, canActivate: [AuthGuard], data: { route: ['ageing-dashboard-report'] } },
      { path: 'client-user', component: ClientUserComponent, canActivate: [AuthGuard], data: { route: ['client-user'] } },
      { path: 'multiple-tab', component: MultipleTabComponent },
      { path: 'tl-deny-report', component: TlDenyReportComponent, canActivate: [AuthGuard], data: { route: ['tl-deny-report'] } },
      { path: 'kyi-report', component: KyireportComponent },
      { path: 'flash-dashboard', component: FlashdashboardReportComponent },
      { path: 'payment-report', component: PaymentReportComponent },
      { path: 'bcbs-data-upload', component: BcbsDataUploadComponent, canActivate: [AuthGuard], data: { route: ['bcbs-data-upload'] } },
      { path: 'unworked-accounts-report', component: UnworkedAccountsReportComponent, canActivate: [AuthGuard], data: { route: ['unworked-accounts-report'] } },
      { path: 'production-report', component: ProductionReportComponent, canActivate: [AuthGuard], data: { route: ['production-report'] } },
      { path: 'citra-audit', component: CitraAuditComponent, canActivate: [AuthGuard], data: { route: ['citra-audit'] } },
      { path: 'citra-employee-mapping', component: CitraEmployeeMappingComponent, canActivate: [AuthGuard], data: { route: ['citra-employee-mapping'] } },
      { path: 'citra-audit-report', component: CitraAuditReportComponent, canActivate: [AuthGuard], data: { route: ['citra-audit-report'] } },
      { path: 'agent-deallocation', component: AgentDeallocationComponent, canActivate: [AuthGuard], data: { route: ['agent-deallocation'] } },
      { path: 'by-agent-deallocation-modal', component: ByAgentDeallocationModalComponent, canActivate: [AuthGuard], data: { route: ['by-agent-deallocation-modal'] } },
      { path: 'by-bucket-deallocation-modal', component: ByBucketDeallocationModalComponent, canActivate: [AuthGuard], data: { route: ['by-bucket-deallocation-modal'] } },
      { path: 'bi-report/:reportType', component: BiReportsComponent, canActivate: [AuthGuard], data: { route: ['bi-report'] } },
      /* productivity report component*/
      { path: 'productivity-report', component: ProductivityReportComponent, canActivate: [AuthGuard], data: { route: ['productivity-report'] } },
      { path: 'agent-productivity-report', component: AgentProductivityReportComponent, canActivate: [AuthGuard], data: { route: ['agent-productivity-report'] } },
      /* client user mapping management*/
      { path: 'client-user-mapping-management', component: ClientUserMappingManagementComponent, canActivate: [AuthGuard], data: { route: ['client-user-mapping-management'] } },

      { path: 'user-menu-mapping', component: UserMenuMappingComponent, canActivate: [AuthGuard], data: { route: ['user-menu-mapping'] } },      // UserMenuMappingComponent      
      // ConcluderMiniInsuranceComponent
      { path: 'concluder-report', component: ConcluderReportComponent, canActivate: [AuthGuard], data: { route: ['concluder-report'] } },
      { path: 'deallocate-concluder', component: DeallocateConcluderComponent, canActivate: [AuthGuard], data: { route: ['deallocate-concluder'] } },
      { path: 'upload-mini-insurance', component: UploadMiniInsuranceComponent, canActivate: [AuthGuard], data: { route: ['upload-mini-insurance'] } },
      { path: '**', component: NotFoundComponent }

    ]),
    NgMultiSelectDropDownModule.forRoot(),
    HttpClientModule
  ],
  providers: [NotificationService, CommonService, ClientUserMappingService],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
//