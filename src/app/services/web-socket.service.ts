import { Injectable } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PusherService } from './pusher.service';
import { Observable, of, ReplaySubject,Subject,Observer } from 'rxjs';
import { environment } from '../models/environment.models';
import { map, tap } from 'rxjs/operators';


@Injectable()
export class WebSocketService {
    private subject: Subject<MessageEvent>;
    private subjectData: Subject<number>;
  private ws: any;
    // For chat box
    public connect(url: string): Subject<MessageEvent> {
        if (!this.subject) {
          console.log("running");
            this.subject = this.create(url);
        }
        return this.subject;
    }

    private create(url: string): Subject<MessageEvent> {
        this.ws = new WebSocket(url);

        let observable = Observable.create(
            (obs: Observer<MessageEvent>) => {
                this.ws.onmessage = obs.next.bind(obs);
                this.ws.onerror   = obs.error.bind(obs);
                this.ws.onclose   = obs.complete.bind(obs);

                return this.ws.close.bind(this.ws);
            });

        let observer = {
            next: (data: Object) => {
                if (this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(JSON.stringify(data));
                }
            }
        };

        return Subject.create(observer, observable);
  }

  public close() {
    console.log('on closing WS');
    this.ws.close()
    this.subject = null
  }

} // end class WebSocketService
