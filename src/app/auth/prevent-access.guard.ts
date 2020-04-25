import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Logger } from '@app/@core/logger.service';

const log = new Logger('PreventAccessGuard');

@Injectable({
  providedIn: 'root',
})
export class PreventAccessGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthenticationService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const allowedRoles = next.data.allowedRoles;
    const isAuthorized = this.authService.isAuthorized(allowedRoles);

    if (isAuthorized) {
      return true;
    }

    log.debug('Not authorized');
    this.router.navigate(['/login']);
    return false;
  }
}
