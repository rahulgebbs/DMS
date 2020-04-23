import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadCountModalComponent } from './read-count-modal.component';

describe('ReadCountModalComponent', () => {
  let component: ReadCountModalComponent;
  let fixture: ComponentFixture<ReadCountModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadCountModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadCountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
