import { TestBed, inject } from '@angular/core/testing';

import { MenuMappingService } from './menu-mapping.service';

describe('MenuMappingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuMappingService]
    });
  });

  it('should be created', inject([MenuMappingService], (service: MenuMappingService) => {
    expect(service).toBeTruthy();
  }));
});
