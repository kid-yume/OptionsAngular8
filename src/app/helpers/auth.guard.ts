import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable,of } from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import { UserService } from '../services/user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  /**  URL to navigate in event user is not authorized! */
 private authorizationUrl = 'login';
 constructor(
      private router: Router,
      private userService: UserService,
 ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log("ger");
    const destinationUrl = state.url;
    return this.userService.loadUser().pipe(
        map(user => {
          console.log("rnot edirecting");
          if(user)
          {
            return true;
          }
        }),
        catchError(() => {
          console.log("redirecting");
          this.router.navigate([this.authorizationUrl], {
            queryParams: {
              'returnUrl': destinationUrl,
            }
          });
          return of(false);
        }));



  //  return true;

}
}
