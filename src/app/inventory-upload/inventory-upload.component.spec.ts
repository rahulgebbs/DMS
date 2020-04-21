import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryUploadComponent } from './inventory-upload.component';

describe('InventoryUploadComponent', () => {
  let component: InventoryUploadComponent;
  let fixture: ComponentFixture<InventoryUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
