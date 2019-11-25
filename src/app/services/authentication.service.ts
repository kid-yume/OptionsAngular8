import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from  '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  /** Whether the user is currently signed into OAuth. */
    isSignedIn = false;
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
     /** A subject sending a boolean whether the api is loaded. */
    private apiLoadedSubject = new ReplaySubject<boolean>(1);
    /** A subject sending a the client that's signed in. */
    private isSignedInSubject = new ReplaySubject<User>(1);


     constructor(private http: HttpClient) {
         this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
         this.currentUser = this.currentUserSubject.asObservable();
         this.apiLoadedSubject.next(true);
         this.apiLoadedSubject.complete();
     }

     public getcurrentUserValue(): User {
         return this.currentUserSubject.value;
     }

     login(username, password) {
      /*   return this.http.post<any>(`${config.apiUrl}/users/authenticate`, { username, password })
             .pipe(map(user => {
                 // store user details and jwt token in local storage to keep user logged in between page refreshes
                 localStorage.setItem('currentUser', JSON.stringify(user));
                 this.currentUserSubject.next(user);
                 return user;
             }));*/
     }

     logout() {
         // remove user from local storage and set current user to null
         localStorage.removeItem('currentUser');
         this.currentUserSubject.next(null);
     }

         /** Returns a stream of the client's loading status. */
      whenLoaded(): Observable<boolean> {
        return this.apiLoadedSubject.asObservable();
      }

      /** Returns a stream of the client's signin status. */
      whenSignedIn(): Observable<User> {
        return this.isSignedInSubject.asObservable();
      }



}
