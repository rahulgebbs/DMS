import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClientUserMappingManagementComponent } from './add-client-user-mapping-management.component';

describe('AddClientUserMappingManagementComponent', () => {
  let component: AddClientUserMappingManagementComponent;
  let fixture: ComponentFixture<AddClientUserMappingManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClientUserMappingManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClientUserMappingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
