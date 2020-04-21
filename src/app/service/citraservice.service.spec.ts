import { TestBed, inject } from '@angular/core/testing';

import { CitraserviceService } from './citraservice.service';

describe('CitraserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CitraserviceService]
    });
  });

  it('should be created', inject([CitraserviceService], (service: CitraserviceService) => {
    expect(service).toBeTruthy();
  }));
});
