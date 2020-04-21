import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientUserMappingManagementComponent } from './client-user-mapping-management.component';

describe('ClientUserMappingManagementComponent', () => {
  let component: ClientUserMappingManagementComponent;
  let fixture: ComponentFixture<ClientUserMappingManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientUserMappingManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientUserMappingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
