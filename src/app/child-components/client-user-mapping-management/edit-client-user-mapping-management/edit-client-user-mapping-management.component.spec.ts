import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClientUserMappingManagementComponent } from './edit-client-user-mapping-management.component';

describe('EditClientUserMappingManagementComponent', () => {
  let component: EditClientUserMappingManagementComponent;
  let fixture: ComponentFixture<EditClientUserMappingManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditClientUserMappingManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClientUserMappingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
