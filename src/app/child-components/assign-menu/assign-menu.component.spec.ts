import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignMenuComponent } from './assign-menu.component';

describe('AssignMenuComponent', () => {
  let component: AssignMenuComponent;
  let fixture: ComponentFixture<AssignMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
