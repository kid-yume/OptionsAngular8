import {  Renderer2, OnInit, Component, HostListener, ElementRef, ViewChild,ChangeDetectorRef } from '@angular/core';
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
export class AppComponent implements OnInit{
  charts!:any
  currentUser: User;
  title = 'OptionsrUs';
  user: User;
  showSpinner = true;
  count = 0;
  showCard = true;

  @ViewChild('bodyC',{static:true}) windowBody!: ElementRef
  @ViewChild('windowHeight',{static:true}) windowDim!: ElementRef
  @ViewChild('optionDiv',{static:true}) optionsC!: ElementRef
  @ViewChild('firstChart',{static:true}) chartRef!:ElementRef


  constructor(
      readonly authService: AuthenticationService,
      readonly userService: UserService,
      readonly pusherService:PusherService,
      private ref: ChangeDetectorRef
  )
  {

    this.authService.whenLoaded().subscribe( () => {
      this.showSpinner = false;
    });
    this.userService.whenUserLoaded().subscribe( (user:User)=>{
      console.log("User loaded"+user.id);
      this.currentUser = user;
      this.optionsC.nativeElement.style.height = this.windowDim.nativeElement.offsetHeight+"px";
      this.showCard = false;
/*
      setTimeout(()=>{
        this.ref.detectChanges();
        console.log("1 second later")
      },100)*/


    });

  }


  @HostListener('window:beforeunload', [ '$event' ])
 beforeUnloadHander(event) {
   // ...
   this.websiteClosed();
 }

 @HostListener('window:scroll', ['$event'])
   doSomething(event) {
     // console.debug("Scroll Event", document.body.scrollTop);
     // see András Szepesházi's comment below
     //console.debug("Scroll Event", window.pageYOffset );
     console.log("Scroll Event", window.pageYOffset );
     if( window.pageYOffset > 100 )
     {
       this.optionsC.nativeElement.style.top = 0;
       //this.optionsC.nativeElement.setProperty("top","0")
     }
   }

  ngOnInit()
  {




  };

  public websiteClosed(){
    this.authService.unSubscribe();
  }


}
