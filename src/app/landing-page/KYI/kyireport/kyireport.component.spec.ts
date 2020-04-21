import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KyireportComponent } from './kyireport.component';

describe('KyireportComponent', () => {
  let component: KyireportComponent;
  let fixture: ComponentFixture<KyireportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KyireportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KyireportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
