import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PusherService } from '../../services/pusher.service';


@Component({
  selector: 'app-stockgraph',
  templateUrl: './stockgraph.component.html',
  styleUrls: ['./stockgraph.component.scss']
})
export class StockgraphComponent implements OnInit {
  StockCompleted = false;
  stockLoading = false;
  stockName = "";



  @ViewChild('stockChart',{static:true}) chartRef!:ElementRef


  constructor(private pusherService:PusherService) {
    this.pusherService.StockSubject.subscribe((info:any) => {
      if(info.request == 0)
      {
        //this.pusherService.messages.next({channel:this.pusherService.channel,"data":{code:info.sym,symbol:""},event:"client-StockDataRequest"});

      }else{

      }


    });

   }

  ngOnInit() {


  }

}
