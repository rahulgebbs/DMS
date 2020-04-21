import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeallocateConcluderComponent } from './deallocate-concluder.component';

describe('DeallocateConcluderComponent', () => {
  let component: DeallocateConcluderComponent;
  let fixture: ComponentFixture<DeallocateConcluderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeallocateConcluderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeallocateConcluderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
