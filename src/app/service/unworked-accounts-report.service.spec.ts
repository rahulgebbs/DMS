import { TestBed, inject } from '@angular/core/testing';

import { UnworkedAccountsReportService } from './unworked-accounts-report.service';

describe('UnworkedAccountsReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnworkedAccountsReportService]
    });
  });

  it('should be created', inject([UnworkedAccountsReportService], (service: UnworkedAccountsReportService) => {
    expect(service).toBeTruthy();
  }));
});
