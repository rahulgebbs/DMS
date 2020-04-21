import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitraAuditComponent } from './citra-audit.component';

describe('CitraAuditComponent', () => {
  let component: CitraAuditComponent;
  let fixture: ComponentFixture<CitraAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitraAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitraAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
