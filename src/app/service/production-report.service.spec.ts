import { TestBed, inject } from '@angular/core/testing';

import { ProductionReportService } from './production-report.service';

describe('ProductionReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductionReportService]
    });
  });

  it('should be created', inject([ProductionReportService], (service: ProductionReportService) => {
    expect(service).toBeTruthy();
  }));
});
