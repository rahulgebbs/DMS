import { TestBed, inject } from '@angular/core/testing';

import { DeallocationByAgentByBucketService } from './deallocation-by-agent-by-bucket.service';

describe('DeallocationByAgentByBucketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeallocationByAgentByBucketService]
    });
  });

  it('should be created', inject([DeallocationByAgentByBucketService], (service: DeallocationByAgentByBucketService) => {
    expect(service).toBeTruthy();
  }));
});
