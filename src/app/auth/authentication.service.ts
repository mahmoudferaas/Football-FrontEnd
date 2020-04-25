import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CredentialsService } from './credentials.service';
import { Credentials } from './models/get-credentials.model';
import { ToastrService } from 'ngx-toastr';
import { LoginResponse } from './models/login-response.model';
import { LoginRequest } from './models/login-request.model';
import { UserService } from './services/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CurrentUserDetails } from './models/current-user-details.model';
import { map } from 'rxjs/operators';

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  jwtHelperService: JwtHelperService;

  constructor(
    private credentialsService: CredentialsService,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.jwtHelperService = new JwtHelperService();
  }

  loginCallback(rememberMe: boolean, response: LoginResponse) {
    if (response && response.status) {
      const credential = <Credentials>{
        token: response.token,
      };
      this.credentialsService.setCredentials(credential, rememberMe);
      this.toastr.success('Successfull login.');
    } else {
      this.toastr.error(response.message || 'Error while trying to login.');
    }

    return response;
  }

  /**
   * Authenticates the user.
   * @param loginInfo The login parameters.
   * @return The user Login Response.
   */
  login(loginInfo: LoginRequest): Observable<LoginResponse> {
    return this.userService.login(loginInfo).pipe(map(this.loginCallback.bind(this, loginInfo.remember)));
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }

  getCurrentUserDetails(): CurrentUserDetails {
    if (this.credentialsService.credentials) {
      let token = this.credentialsService.credentials.token;

      if (token && !this.jwtHelperService.isTokenExpired(token)) {
        let decodeToken = this.jwtHelperService.decodeToken(token);

        return <CurrentUserDetails>{
          userId: decodeToken.UserID,
          userName: decodeToken.UserName,
          email: decodeToken.Email,
          role: decodeToken.role,
        };
      }
      this.toastr.error('Expired Token');
      return null;
    }
  }

  get currentUserName(): string {
    if (this.credentialsService.credentials) {
      let token = this.credentialsService.credentials.token;

      if (token && !this.jwtHelperService.isTokenExpired(token)) {
        let decodeToken = this.jwtHelperService.decodeToken(token);

        return <string>decodeToken.UserName;
      }
    }
  }

  isAuthenticated(): boolean {
    if (this.credentialsService.credentials) {
      let token = this.credentialsService.credentials.token;

      return token && !this.jwtHelperService.isTokenExpired(token);
    }
    return false;
  }

  isAuthorized(allowedRoles: string[]): boolean {
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    if (this.credentialsService.credentials) {
      const token = this.credentialsService.credentials.token;

      if (token && !this.jwtHelperService.isTokenExpired(token)) {
        const decodeToken = this.jwtHelperService.decodeToken(token);

        return allowedRoles.includes(decodeToken['role']);
      }
      this.toastr.error('Invalid token');
      return false;
    }
  }

  isAdministratorUser(): boolean {
    return this.isAuthorized(['Administrator']);
  }
}
