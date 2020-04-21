import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitraAccountsModalComponent } from './citra-accounts-modal.component';

describe('CitraAccountsModalComponent', () => {
  let component: CitraAccountsModalComponent;
  let fixture: ComponentFixture<CitraAccountsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitraAccountsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitraAccountsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
