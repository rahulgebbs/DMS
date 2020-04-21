import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitraEmployeeMappingComponent } from './citra-employee-mapping.component';

describe('CitraEmployeeMappingComponent', () => {
  let component: CitraEmployeeMappingComponent;
  let fixture: ComponentFixture<CitraEmployeeMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitraEmployeeMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitraEmployeeMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
