import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallReferenceComponent } from './call-reference.component';

describe('CallReferenceComponent', () => {
  let component: CallReferenceComponent;
  let fixture: ComponentFixture<CallReferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallReferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
