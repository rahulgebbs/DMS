import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryHighPriorityComponent } from './inventory-high-priority.component';

describe('InventoryHighPriorityComponent', () => {
  let component: InventoryHighPriorityComponent;
  let fixture: ComponentFixture<InventoryHighPriorityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryHighPriorityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryHighPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
