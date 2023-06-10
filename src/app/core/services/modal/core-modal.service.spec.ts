import { TestBed } from '@angular/core/testing';

import { CoreModalService } from './core-modal.service';

describe('CoreModalService', () => {
  let service: CoreModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
