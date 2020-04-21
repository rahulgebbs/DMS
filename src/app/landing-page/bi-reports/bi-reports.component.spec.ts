import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiReportsComponent } from './bi-reports.component';

describe('BiReportsComponent', () => {
  let component: BiReportsComponent;
  let fixture: ComponentFixture<BiReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
