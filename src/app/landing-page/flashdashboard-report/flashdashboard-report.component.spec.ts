import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashdashboardReportComponent } from './flashdashboard-report.component';
import { Router } from '@angular/router';
describe('FlashdashboardReportComponent', () => {
  let component: FlashdashboardReportComponent;
  let fixture: ComponentFixture<FlashdashboardReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashdashboardReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashdashboardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
