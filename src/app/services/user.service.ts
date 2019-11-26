import { Injectable } from '@angular/core';
import {Observable, of, ReplaySubject, throwError} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

import {User} from '../models/user.model';

import {AuthenticationService} from './authentication.service';
//import {AuthService} from './auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /** Implements ApiService's apiEndpoint requirement. */
  apiEndpoint = 'user';
  /** User instance of the current logged in user. */
  user!: User;
  /** A subject sending the loaded user. */
  private userLoadedSubject = new ReplaySubject<User>(1);

  constructor(
      private readonly authService: AuthenticationService) { }
      /** Returns a observable for when the user info is loaded in the service. */

  whenUserLoaded(): Observable<User> {
      return this.userLoadedSubject.asObservable();
    }

  loadUser(): Observable<User> {
    if (this.user) {
      return this.userLoadedSubject.asObservable();
    }



    return this.authService.whenLoaded().pipe(
        switchMap(() => {
          if (!this.authService.isSignedIn) {
            console.log("not working");
            return throwError('Client not signed in. Redirecting.');
          }
          return this.authService.whenSignedIn();
        }),
        switchMap((user) => {
          console.log("building User");
          this.user = new User();
          this.user.id = 1;
          this.user.firstName = "Aaron";
          this.user.username = "Downing";
          this.userLoadedSubject.next(this.user);
          this.userLoadedSubject.complete();
          return of(this.user);
        }),
    );
  }


}
