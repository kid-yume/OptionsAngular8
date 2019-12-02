import { Component, NgZone, HostListener } from '@angular/core';
import { UserService } from './services/user.service'
import { AuthenticationService } from './services/authentication.service';
import { PusherService } from './services/pusher.service';
import { Router } from '@angular/router';

import {User} from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @HostListener('window:beforeunload', [ '$event' ])
 beforeUnloadHander(event) {
   // ...
   this.websiteClosed();
 }

  title = 'OptionsrUs';
  user: User;
  showSpinner = true;
  count = 0;


  constructor(
      readonly authService: AuthenticationService,
      readonly userService: UserService,
      readonly pusherService:PusherService,
      readonly ngZone: NgZone
  )
  {

    this.authService.whenLoaded().subscribe(() => {
      this.showSpinner = false;
    });
/*
    this.pusherService.channelConnectSignal.subscribe((message:any) =>
    {


      //var ex = JSON.parse(message);
      console.log(this.count+"uh" +JSON.stringify(message.auth)+"" +JSON.stringify(message.auth).indexOf(":"));
      //let tes = ex.data.auth+"";
      if(this.count == 0 && JSON.stringify(message.auth).indexOf(":") != -1)
      {
        this.count +=1;
        console.log("sendin" +JSON.stringify(message.auth));
        this.pusherService.messages.next({"data":{channel:"private-testChannel",auth:message.auth},event:"pusher:subscribe"});

      }

    });


    this.pusherService.signal.subscribe((message:any) =>
    {


      //var ex = JSON.parse(message);
      //console.log("uh" +JSON.stringify(message.auth));
      //let tes = ex.data.auth+"";
      if(this.count == 0)
      {
        //this.count +=1;
        //this.pusherService.messages.next({"data":{channel:"private-testChannel",auth:message.auth},event:"pusher:subscribe"});

      }

    });

     this.pusherService.messages.subscribe((message:any) => {
          //this.test = JSON.parse(message);
          //console.log(test);
          //retry(1),

          try{
            this.test = message;
            //let form = JSON.stringify(message);
            console.log("uh "+ Object.keys(message));

          }catch
          {
            //console.log("uh merror"+JSON.stringify(message));
            if(this.count == 0)
            {
            //  this.count +=1;
              //this.pusherService.messages.next(message);

            }


          }





       });*/

    /*
    userService.whenUserLoaded().subscribe(user => {
      this.user = user;
    });*/

  }

  public websiteClosed(){
    this.authService.unSubscribe();
  }


}
