import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitraAuditReportComponent } from './citra-audit-report.component';

describe('CitraAuditReportComponent', () => {
  let component: CitraAuditReportComponent;
  let fixture: ComponentFixture<CitraAuditReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitraAuditReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitraAuditReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
