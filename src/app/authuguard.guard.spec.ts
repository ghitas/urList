import { TestBed, async, inject } from '@angular/core/testing';

import { AuthuguardGuard } from './authuguard.guard';

describe('AuthuguardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthuguardGuard]
    });
  });

  it('should ...', inject([AuthuguardGuard], (guard: AuthuguardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
