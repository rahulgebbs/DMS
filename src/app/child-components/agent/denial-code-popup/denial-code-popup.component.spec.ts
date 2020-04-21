import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DenialCodePopupComponent } from './denial-code-popup.component';

describe('DenialCodePopupComponent', () => {
  let component: DenialCodePopupComponent;
  let fixture: ComponentFixture<DenialCodePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DenialCodePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DenialCodePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
