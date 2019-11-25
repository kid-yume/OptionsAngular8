import { TestBed } from '@angular/core/testing';

import { SignatureRequestService } from './signature-request.service';

describe('SignatureRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SignatureRequestService = TestBed.get(SignatureRequestService);
    expect(service).toBeTruthy();
  });
});
