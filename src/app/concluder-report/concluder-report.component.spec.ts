import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcluderReportComponent } from './concluder-report.component';

describe('ConcluderReportComponent', () => {
  let component: ConcluderReportComponent;
  let fixture: ComponentFixture<ConcluderReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcluderReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcluderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
