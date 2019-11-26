import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from  '../models/user.model';
import { PusherService } from '../services/pusher.service';

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


     constructor(private http: HttpClient,
                 private pusherService: PusherService) {
         this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
         this.currentUser = this.currentUserSubject.asObservable();
         //Awaiting the websocket to open and connect to the Login Channel
         this.pusherService.messages.subscribe((message:any) => {});

         this.pusherService.channelLoginConnect.subscribe((message: any) => {
           let cName = message.channelName;
           message = message.data;
           this.pusherService.messages.next({"data":{channel:cName,auth:message.auth},event:"pusher:subscribe"});
           this.apiLoadedSubject.next(true);
           this.apiLoadedSubject.complete();
         });


         //this.apiLoadedSubject.next(true);
         //this.apiLoadedSubject.complete();
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
        return this.pusherService.whenPusherLoginReady();
      }

      /** Returns a stream of the client's signin status. */
      whenSignedIn(): Observable<User> {
        return this.isSignedInSubject.asObservable();
      }



}
