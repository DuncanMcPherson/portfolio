import { TestBed } from '@angular/core/testing';

import { ErrorMessageConfigService } from './error-message-config.service';

describe('ErrorMessageConfigService', () => {
  let service: ErrorMessageConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorMessageConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
