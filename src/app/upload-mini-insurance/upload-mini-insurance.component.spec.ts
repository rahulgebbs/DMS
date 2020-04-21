import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMiniInsuranceComponent } from './upload-mini-insurance.component';

describe('UploadMiniInsuranceComponent', () => {
  let component: UploadMiniInsuranceComponent;
  let fixture: ComponentFixture<UploadMiniInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadMiniInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadMiniInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
