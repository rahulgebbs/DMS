import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentProductivityReportComponent } from './agent-productivity-report.component';

describe('AgentProductivityReportComponent', () => {
  let component: AgentProductivityReportComponent;
  let fixture: ComponentFixture<AgentProductivityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentProductivityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentProductivityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
