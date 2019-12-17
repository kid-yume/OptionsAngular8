import { Component, OnInit,ViewChild,HostListener, ElementRef,  } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {chart} from 'highcharts';
import {stockChart }from 'highcharts/highstock';
import { SAMPLE_DATA } from '../../helpers/stock-symbols';
import { PusherService } from '../../services/pusher.service';


export class contracts {
  strike:number;
  code:string;
  expiration:Date;
  constructor(s:number,c:string,e:Date)
  {
    this.strike = s;
    this.code = c;
    this.expiration = e;
  }

}

export interface contractParams {
  strike:number;
  code:string;
  expiration:Date;

}

@Component({
  selector: 'app-optionlist',
  templateUrl: './optionlist.component.html',
  styleUrls: ['./optionlist.component.scss']
})
export class OptionlistComponent implements OnInit {

  currentCompany = "APPL";
  charts!:any;
  CallMonthSelected = false;
  showSpinner = false;
  RankCompleted=false;
  sb ="";
  MonthsContracts = new Map<string, contracts[]>();
  timePeriods = ["", "", ""];
  callExpDates = ["","",""];
  REC_DATA:any  = [];
  RANK_DATA:any = [];
  CONTRACT_DATA: contractParams[] = [
    {strike:1,code:"", expiration:new Date()},
  ];

  timePeriodsBackwards = [
    'Long nineteenth century',
    'Early modern period',
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century',
    'Early modern period',
    'Long nineteenth century'
  ];
  MonthArray :string[]=["January","February","March","April","May","June","July", "August","September","October","November","December"];

  @ViewChild('optionChart',{static:true}) chartRef!:ElementRef
  @ViewChild('rankChart',{static:true}) rankRef!:ElementRef

  constructor(private pusherService: PusherService) { }

  ngOnInit() {

    this.pusherService.InitialSubject.subscribe((message:any) => {
      console.log(message);
      let CurSym = message.ranks;
      this.RANK_DATA = message.rankhis;
      this.currentCompany = CurSym[0].symbol+"";
      let i = 0;
      for(let months in message.calls)
      {
        var d = new Date((Date.now()));
        d = new Date(d.setMonth(d.getMonth()+i));
        console.log("Month:"+this.MonthArray[d.getMonth()]+" "+i);
        this.timePeriods[i] =  this.MonthArray[d.getMonth()];
        console.log(message.calls[""+this.MonthArray[d.getMonth()]]);
        let ii = 0;
        let enumerableKeys = [];
        for (let key in message.calls[""+this.MonthArray[d.getMonth()]]) {
          enumerableKeys.push(key);
        }
        for(let show in enumerableKeys)
        {
          //console.log(show);
        }
        console.log(enumerableKeys);
        console.log("rank history >");
        console.log(message["rankHis"]);

        //console.log();

        let currentMonth =  message.calls[""+this.MonthArray[d.getMonth()]];
        console.log(currentMonth);
        let cc = [];
        for(let c in currentMonth)
        {
          //console.log(c[ii]);
          let ob = currentMonth;
          cc.push({strike:parseFloat(ob[ii].strike),code:ob[ii].code,expiration:new Date(ob[ii].expiration + "")});
          ii++;

        }
        this.MonthsContracts.set(this.MonthArray[d.getMonth()],cc);
        this.CONTRACT_DATA = [];
        this.pusherService.SymbolSubject.next({symbol:this.currentCompany});


        //console.log(message.calls[this.MonthArray[d.getMonth()]]);
        //console.log(this.CONTRACT_DATA);
        //this.timePeriods.push(this.MonthArray[d.getMonth()]);
        i++;

      }
      console.log("dict\n")
      console.log(this.MonthsContracts);

      console.log(this.RANK_DATA)
      chart(this.rankRef.nativeElement, {

            xAxis: {
              type: 'datetime'
            },
            yAxis: {
                reversed: true
            },

            series: [{
              name: 'Rank History',
              data: this.RANK_DATA
            }]
          });

        this.RankCompleted = true;
      //console.log(message.calls["December"]);
      /*for (call in message.calls)
      {
        timePeriods.push(call.)
      }*/

    });
    this.pusherService.GraphSubject.subscribe((messages:any) => {

      console.log(messages);
      let convertS = ""+messages;
      this.sb+= convertS.substring(0,messages.length-1);
      if(!this.showSpinner)
      {
        this.showSpinner = true;
      }
      //this.sb = this.CleanMessage(this.sb);
      if(this.sb.indexOf("!ENDOFMESSAGE") != -1)
      {
        console.log("before \n"+this.sb);
        this.sb =this.CleanMessage(this.sb);
        console.log("after \n"+this.sb);
        let test = JSON.parse(this.sb);
        console.log(test);
        this.showSpinner = false;
        console.log(test.chunk);
        this.REC_DATA = test.chunk;

        stockChart(this.chartRef.nativeElement, {
          plotOptions: {
          candlestick: {
              color: 'red',
              upColor: 'green'
          }
            },

            rangeSelector: {
                selected: 1
            },

            title: {
                text: this.currentCompany+' Options'
            },

            series: [{
                type: 'candlestick',
                name: this.currentCompany+' Options',
                data: this.REC_DATA,

            }]
        });



        this.sb = '';

      }


    });

  /*  this.pusherService.GraphingSubject.subscribe((message:any) => {


  });*/



  }


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
  }

  CallSelected(text:any)
  {
    this.CONTRACT_DATA = this.MonthsContracts.get(text);
    this.CallMonthSelected = true;
    this.showSpinner = true;
  }

  logThis(text:any,code:any)
  {
    //console.log(text,code);
    console.log(code);
    this.pusherService.messages.next({channel:this.pusherService.channel,"data":{code:(code+""),symbol:(this.currentCompany)},event:"client-GraphDataRequest"});



    this.CallMonthSelected = true;

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
