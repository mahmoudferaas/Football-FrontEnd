import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpInterceptor } from '@angular/common/http';

import { HttpService } from './http.service';
import { ErrorHandlerInterceptor } from './error-handler.interceptor';
import { ApiPrefixInterceptor } from './api-prefix.interceptor';
import { ApiJWTInterceptor } from './api-jwt.interceptor';

describe('HttpService', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let interceptors: HttpInterceptor[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ErrorHandlerInterceptor,
        ApiPrefixInterceptor,
        ApiJWTInterceptor,
        {
          provide: HttpClient,
          useClass: HttpService,
        },
      ],
    });

    http = TestBed.get(HttpClient);
    httpMock = TestBed.get(HttpTestingController as Type<HttpTestingController>);

    const realRequest = http.request;
    spyOn(HttpService.prototype, 'request').and.callFake(function (
      this: any,
      method: string,
      url: string,
      options?: any
    ) {
      interceptors = this.interceptors;
      return realRequest.call(this, method, url, options);
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should use error handler, API prefix and no cache by default', () => {
    // Act
    const request = http.get('/toto');

    // Assert
    request.subscribe(() => {
      expect(http.request).toHaveBeenCalled();
      expect(interceptors.some((i) => i instanceof ApiPrefixInterceptor)).toBeTruthy();
      expect(interceptors.some((i) => i instanceof ErrorHandlerInterceptor)).toBeTruthy();
    });
    httpMock.expectOne({}).flush({});
  });

  it('should use cache', () => {
    // Act
    const request = http.cache().get('/toto');

    // Assert
    request.subscribe(() => {
      expect(interceptors.some((i) => i instanceof ApiPrefixInterceptor)).toBeTruthy();
      expect(interceptors.some((i) => i instanceof ErrorHandlerInterceptor)).toBeTruthy();
    });
    httpMock.expectOne({}).flush({});
  });

  it('should skip error handler', () => {
    // Act
    const request = http.skipErrorHandler().get('/toto');

    // Assert
    request.subscribe(() => {
      expect(interceptors.some((i) => i instanceof ApiPrefixInterceptor)).toBeTruthy();
      expect(interceptors.some((i) => i instanceof ErrorHandlerInterceptor)).toBeFalsy();
    });
    httpMock.expectOne({}).flush({});
  });

  it('should not use API prefix', () => {
    // Act
    const request = http.disableApiPrefix().get('/toto');

    // Assert
    request.subscribe(() => {
      expect(interceptors.some((i) => i instanceof ApiPrefixInterceptor)).toBeFalsy();
      expect(interceptors.some((i) => i instanceof ErrorHandlerInterceptor)).toBeTruthy();
    });
    httpMock.expectOne({}).flush({});
  });
});
