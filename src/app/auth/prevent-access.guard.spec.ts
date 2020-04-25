import { TestBed } from '@angular/core/testing';

import { PreventAccessGuard } from './prevent-access.guard';

describe('PreventAccessGuard', () => {
  let guard: PreventAccessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PreventAccessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
