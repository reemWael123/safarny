import { TestBed } from '@angular/core/testing';

import { InterceptorNameInterceptor } from './interceptor-name.interceptor';

describe('InterceptorNameInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      InterceptorNameInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: InterceptorNameInterceptor = TestBed.inject(InterceptorNameInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
