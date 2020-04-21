import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMenuMappingComponent } from './user-menu-mapping.component';

describe('UserMenuMappingComponent', () => {
  let component: UserMenuMappingComponent;
  let fixture: ComponentFixture<UserMenuMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMenuMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMenuMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
