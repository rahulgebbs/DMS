import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallReferenceInfoComponent } from './call-reference-info.component';

describe('CallReferenceInfoComponent', () => {
  let component: CallReferenceInfoComponent;
  let fixture: ComponentFixture<CallReferenceInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallReferenceInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallReferenceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
