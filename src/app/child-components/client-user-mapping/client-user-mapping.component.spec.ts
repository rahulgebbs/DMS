import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientUserMappingComponent } from './client-user-mapping.component';

describe('ClientUserMappingComponent', () => {
  let component: ClientUserMappingComponent;
  let fixture: ComponentFixture<ClientUserMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientUserMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientUserMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
