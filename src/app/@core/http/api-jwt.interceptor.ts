import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsService } from '@app/auth';
import { Router } from '@angular/router';

/**
 * Add JWT auth token header to all requests.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiJWTInterceptor implements HttpInterceptor {
  constructor(private credentialsService: CredentialsService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.credentialsService.credentials) {
      var authToken = this.credentialsService.credentials.token;

      if (authToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `bearer ${authToken}`,
            'Access-Control-Allow-Origin': '*',
          },
        });
      } else {
        this.credentialsService.setCredentials();
        this.router.navigateByUrl('/login');
      }
    }

    return next.handle(request);
  }
}
