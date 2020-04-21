import { TestBed, inject } from '@angular/core/testing';

import { CitraAuditReportService } from './citra-audit-report.service';

describe('CitraAuditReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CitraAuditReportService]
    });
  });

  it('should be created', inject([CitraAuditReportService], (service: CitraAuditReportService) => {
    expect(service).toBeTruthy();
  }));
});
