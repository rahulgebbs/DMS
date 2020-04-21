import { TestBed, inject } from '@angular/core/testing';

import { CitraEmployeeMappingService } from './citra-employee-mapping.service';

describe('CitraEmployeeMappingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CitraEmployeeMappingService]
    });
  });

  it('should be created', inject([CitraEmployeeMappingService], (service: CitraEmployeeMappingService) => {
    expect(service).toBeTruthy();
  }));
});
