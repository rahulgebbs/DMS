import { TestBed, inject } from '@angular/core/testing';

import { BireportService } from './bireport.service';

describe('BireportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BireportService]
    });
  });

  it('should be created', inject([BireportService], (service: BireportService) => {
    expect(service).toBeTruthy();
  }));
});
