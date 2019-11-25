import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../models/environment.models';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import {Observable, of, ReplaySubject,Subject, Observer} from 'rxjs';
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
  private pusherLoadedSubject = new ReplaySubject<boolean>(1);
  private subject: Subject<MessageEvent>;
  private subjectData: Subject<number>;
  public messages: Subject<any>  = new Subject<any>();
  public signal:Subject<any> = new Subject<any>();
  public channelConnectSignal:Subject<any> = new Subject<any>();
  private ws: any;
  apiURL: string = "https://stocksymbols.azurewebsites.net/api/SignatureTrigger?code=znyU8hQUJY96rNT/AnqxJ2FpOZN56qkAatwtCLcYw3BeNjhQihzZzQ==";
  pUrl:string = "https://oddioboxappceleratorconnector.azurewebsites.net/api/PusherEventCatcher?code=8AI21C2Y4zYqIbBArFFaMf8373EYoZZOHPFlI52pbbt4BRbK5ZbFrQ==";




  constructor(private http: HttpClient) {

    //console.log("runningnot12");
    if(!this.loaded)
    {
      console.log("running");
      this.StartSocket();
    }
    //console.log("runningnot");
  }
  private  StartSocket()
  {
    console.log('wss://wss.pusherapp.com:443/app/'+environment.pusher.key+"?client=js&version=3.1&protocol=5");
    this.messages = <Subject<any>>this
               .connect('wss://wss.pusherapp.com:443/app/'+environment.pusher.key+"?client=js&version=3.1&protocol=5")
               .pipe(map((response: any): any => {
                   retry(1),
                   console.log("got it"+response.data);

                   return JSON.parse(response.data) }),
                 map((response:any):any =>{
                   try{
                     let socket_idt = JSON.parse(response.data);

                     console.log("use it here"+JSON.stringify(socket_idt.socket_id));
                     return this.http.post(this.pUrl,{socket_id:socket_idt.socket_id,channel:"private-testChannel"},{headers:new HttpHeaders({'Access-Control-Allow-Origin':'*'})}).
                                      subscribe((data:any):any=> {
                                        console.log('this what yo relaly got'+ JSON.stringify(data));
                                        //this.messages.next(data.auth)
                                        //this.signal.next(JSON.parse(data.auth));
                                        if(data.authFina)
                                        {
                                          this.channelConnectSignal.next(JSON.parse(JSON.stringify(data.authFina)));
                                        }

                                        return data;
                                      });

                   }catch
                   {
                     console.log(JSON.stringify(response))
                     return response;
                   }

                 })
                // map((response:any):any =>{



                // })
              );
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

  whenLoaded(): Observable<boolean> {
      return this.pusherLoadedSubject.asObservable();
    }




}
