import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PusherService } from '../../services/pusher.service';

import {stockChart }from 'highcharts/highstock';

@Component({
  selector: 'app-stockgraph',
  templateUrl: './stockgraph.component.html',
  styleUrls: ['./stockgraph.component.scss']
})
export class StockgraphComponent implements OnInit {
  StockStarted = false;
  stockLoading = false;
  stockName = "";
  sb = "";
  REC_DATA:any  = [];
  GraphLoading = false;



  @ViewChild('stockChart',{static:true}) chartRef!:ElementRef


  constructor(private pusherService:PusherService) {
    this.pusherService.StockSubject.subscribe((info:any) => {
      if(info.request == 0)
      {
        this.GraphLoading = true;
        this.StockStarted= false;
        this.stockName = ""+info.sym;
        this.pusherService.messages.next({channel:this.pusherService.channel,"data":{code:info.sym,symbol:""},event:"client-StockDataRequest"});

      }else{

        console.log(info);
        let convertS = ""+info;
        this.sb+= convertS.substring(0,info.length-1);
      /*  if(!this.showSpinner)
        {
          this.showSpinner = true;
        }*/
        //this.sb = this.CleanMessage(this.sb);
        if(this.sb.indexOf("!ENDOFMESSAGE") != -1)
        {
          console.log("before \n"+this.sb);
          this.sb =this.CleanMessage(this.sb);
          console.log("after \n"+this.sb);
          let test = JSON.parse(this.sb);
          console.log(test);
          //this.showSpinner = false;
          console.log(test.chunk);
          this.REC_DATA = test.chunk;
          //this.GraphLoading = false;
          //this.GraphLoaded = true;
          this.GraphLoading = false;
          this.StockStarted= true;

          stockChart(this.chartRef.nativeElement, {

              rangeSelector: {
                  selected: 1
              },

              title: {
                  text: this.stockName+' Stock Price History'
              },

              series: [{
                tooltip: {
                      valueDecimals: 2
                  },
                  name: this.stockName+' price',
                  data: this.REC_DATA,
                  type:'line'

              }]
          });





          this.sb = '';

        }


      }


    });

   }

  ngOnInit() {


  }



  public CleanMessage(message:string):string
  {//Remove: "chunk":"{\"ranks\" replace with "ranks"
   //remove } at end
   // remove all backslashes

   //Remove "{"chunk":"
   //remove } at end
   //remove all backslashes

   //If !ENDOFMESSAGE "}remove }"
    let returns = "";
    returns = message.replace("\"chunk\":\"","\"chunk\":");
    returns= returns.replace("\"{\"chunk\":\"", '');
    returns = returns.replace(/\"{\"chunk\":\"/g,'');
    returns= returns.replace(/\\/g, '');
    returns = returns.replace("!ENDOFMESSAGE \"",'');
    returns += "}"
    //console.log("fired");
    return returns;
  }

}
