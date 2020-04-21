import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionEmployeeSelectorModalComponent } from './production-employee-selector-modal.component';

describe('ProductionEmployeeSelectorModalComponent', () => {
  let component: ProductionEmployeeSelectorModalComponent;
  let fixture: ComponentFixture<ProductionEmployeeSelectorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionEmployeeSelectorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionEmployeeSelectorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
