import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteClientUserMappingManagementComponent } from './delete-client-user-mapping-management.component';

describe('DeleteClientUserMappingManagementComponent', () => {
  let component: DeleteClientUserMappingManagementComponent;
  let fixture: ComponentFixture<DeleteClientUserMappingManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteClientUserMappingManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteClientUserMappingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
