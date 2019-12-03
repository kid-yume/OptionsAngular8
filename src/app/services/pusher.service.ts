import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../models/environment.models';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import {Observable, of, ReplaySubject,Subject, Observer, AsyncSubject} from 'rxjs';
import { share,map, tap, retry } from "rxjs/operators";
import { SignatureRequestService } from './signature-request.service'
//import { WebSocketService } from "./WebSocketService";


export interface WebsocketResponse{
  event: string;
  data: object;
}

export interface AzureResponse{
  event: string;
  data: string;
}

export interface PrivateChannelSubscribeMessageba{
  event: string;
  data: object;
}
export interface SignatureRequest
{
  name:string;
  socket_id:string;
}


@Injectable({
  providedIn: 'root'
})
export class PusherService {
  socket$!:any;
  test!:any;
  loaded = false;
  channel ='';
  private pusherLoadedSubject = new ReplaySubject<boolean>(1);
  private channelLoadedSubject = new ReplaySubject<boolean>(1);
  private subject: Subject<MessageEvent>;
  private subjectData: Subject<number>;
  public messages: Subject<any>  = new Subject<any>();
  public signal:Subject<any> = new Subject<any>();
  public channelConnectSignal:Subject<any> = new Subject<any>();
  public channelLoginConnect:Subject<any> = new Subject<any>();
  public isSignedInSubject:Subject<any> = new Subject<any>();
  private ws: any;
  private _socket_id: any;
  private repeatData:any;
  apiURL: string = "https://stocksymbols.azurewebsites.net/api/SignatureTrigger?code=znyU8hQUJY96rNT/AnqxJ2FpOZN56qkAatwtCLcYw3BeNjhQihzZzQ==";
  pUrl:string = "https://oddioboxappceleratorconnector.azurewebsites.net/api/PusherEventCatcher?code=8AI21C2Y4zYqIbBArFFaMf8373EYoZZOHPFlI52pbbt4BRbK5ZbFrQ==";




  constructor(private http: HttpClient) {

    //console.log("runningnot12");
    if(!this.loaded)
    {
      console.log("running");
      this.StartSocket();
      this.loaded = true;
    }
    this.messages.subscribe((message:any) => {});
    //console.log("runningnot");
  }

  private StartSocket()
  {
    console.log('wss://wss.pusherapp.com:443/app/'+environment.pusher.key+"?client=js&version=3.1&protocol=5");
    this.messages = <Subject<any>>this
               .connect('wss://wss.pusherapp.com:443/app/'+environment.pusher.key+"?client=js&version=3.1&protocol=5")
               .pipe(map((response: any): any => {
                   retry(1);
                   if(!this.repeatData)
                   {console.log("running");this.repeatData = JSON.stringify({junk:"bob"})}
                   console.log( "Last Received:"+JSON.stringify(this.repeatData)+' and \n Received: '+ JSON.stringify(response.data));
                   let compareMe = this.isEquivalent(this.repeatData,response.data);
                   if(!compareMe)
                   {
                     console.log( "Not Equivalent: \nLast Received:"+JSON.stringify(this.repeatData)+' and \n Received: '+ JSON.stringify(response.data));
                     this.repeatData = response.data;
                     //console.log('Trying .. '+ JSON.stringify(response.data)+ " and \n storing "+JSON.stringify(this.repeatData));
                     return JSON.parse(response.data);
                   }else{
                     //console.log('repeat'+ JSON.stringify(response.data));
                     //console.log( "Equivalent: \nLast Received:"+JSON.stringify(this.repeatData)+' and \n Received: '+ JSON.stringify(response.data));

                     this.repeatData = response.data;
                     return null;
                   }


                    }),
                 map( (response:any):any =>  {
                  try{
                      var analyze = JSON.parse(response.data);
                      if(analyze.hasOwnProperty('socket_id'))
                      {
                        console.log("initial join channel message"+analyze.socket_id);
                        this._socket_id = analyze.socket_id;
                        this.joinChannel('private-masterLoginChannel');

                      }
                      else
                      {
                        console.log("No socket_id message ^_^ \n"+JSON.stringify(response));
                        this.transportMessage(response);

                      }
                    }

                    catch
                    {
                      //console.log("null value");
                    }


                   /*
                   try{
                      analyze = JSON.parse(response.data);
                      console.log("initial join channel message"+analyze.socket_id);
                      this._socket_id = analyze.socket_id;
                      this.joinChannel('private-masterLoginChannel');
                   }catch{ analyze = null; console.log("something went wrong lol")}*/


                 }));
  }

  public async transportMessage(data:any)
  {
    //let test = JSON.parse(data);

    console.log("event \n"+ data.channel);
    switch((data.event+"")){
      case "pusher_internal:subscription_succeeded":
        if(data.channel == ('private-'+this._socket_id+"channel"))
        {
          this.channelLoadedSubject.next(true);
          this.channelLoadedSubject.complete();
          this.messages.next({channel:('private-masterLoginChannel'),"data":{channelN:('private-'+this._socket_id+"channel")},event:"client-Register"});
        }else{
          this.channel = 'private-'+this._socket_id+"channel";
          this.joinChannel('private-'+this._socket_id+"channel");
        }
        break;
      case "pusher:error":
        this.joinChannel('private-masterLoginChannel');
        break;
      case "client-LoginResponse":
        var data = JSON.parse(data.data);
        console.log("data "+data.status);
        if((data.status) == 200)
        {this.isSignedInSubject.next(data);}
        else{console.log('fails');}

        break;

    }



  }

  //using as a means to go join channels from many things.
  public async joinChannel(channelName :string){
    this.http.post(this.pUrl,{socket_id:this._socket_id,channel:channelName},{headers:new HttpHeaders({'Access-Control-Allow-Origin':'*'})}).
                     subscribe((datas:any):any=> {
                       console.log('this what yo relaly got'+ JSON.stringify(datas)+"from "+channelName);
                       //this.messages.next(data.auth)
                       //this.signal.next(JSON.parse(data.auth));
                       if(datas.authFina)
                       {
                         this.channelLoginConnect.next({data:JSON.parse(JSON.stringify(datas.authFina)),channelName:channelName});
                       }else{
                          //error retry :/
                          console.log("error");
                          //this.joinChannel(channelName);
                       }

                       return datas;
                     });





  }
  public async SuccessfulLogin( data:any )
  {





  }

  private connect(url: string): Subject<MessageEvent> {
    console.log("connecting");
        if (!this.subject) {
            this.subject = this.create(url);
        }
        return this.subject;
    }

  private create(url: string): Subject<MessageEvent> {
    console.log("creating");
          this.ws = new WebSocket(url);

          let observable = Observable.create(
              (obs: Observer<MessageEvent>) => {
                  this.ws.onmessage = obs.next.bind(obs);
                  this.ws.onerror   = obs.error.bind(obs);
                  this.ws.onclose   = obs.complete.bind(obs);

                  return this.ws.close.bind(this.ws);
              }).pipe(share());

          let observer = {
              next: (data: Object) => {
                  if (this.ws.readyState === WebSocket.OPEN) {
                    try{
                      console.log("sending"+JSON.stringify(JSON.stringify(data)));
                      this.ws.send(JSON.stringify(data));
                      //this.ws.send(data);
                    }catch
                    {
                      console.log("broke");
                      this.ws.send(data);
                    }

                  }
              }
          };

          return Subject.create(observer, observable);
    }

  private close() {
     console.log('on closing WS');
     this.ws.close();
     this.subject = null;
    }

  private isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    //Create Arrays of Sub props too
    var eventNameA = JSON.parse(a);
    var eventNameB = JSON.parse(b);

    if(JSON.stringify(eventNameA.event) === JSON.stringify(eventNameB.event)){
      if(eventNameB.event == "client-Register" )
      {return true}

      if(eventNameB.event == "client-LoginResponse" )
      {return false}

      if(JSON.stringify(eventNameA.channel) === JSON.stringify(eventNameB.channel))
      {return true;}
      else
      {return false}

    }


    /*let jsonDataA = JSON.parse()
    var subProps = Object.getOwnPropertyNames(a.data);
    var subProps = Object.getOwnPropertyNames(b.data);*/


      // If number of properties is different,
      // objects are not equivalent
      if (aProps.length != bProps.length) {
          return false;
      }

      for (var i = 0; i < aProps.length; i++) {
          var propName = aProps[i];

          // If values of same property are not equal,
          // objects are not equivalent
          if (a[propName] !== b[propName]) {
              return false;
          }
      }

      // If we made it this far, objects
      // are considered equivalent
    return true;
    }

  whenLoaded(): Observable<boolean> {
      return this.pusherLoadedSubject.asObservable();
    }
  whenPusherLoginReady():Observable<boolean>{
      return this.channelLoadedSubject.asObservable();
  }


  public LeaveChannel(){
    this.messages.next({channel:('private-'+this._socket_id+"channel"),"data":{channelN:("eracving")},event:"client-Register"});

  }




}
