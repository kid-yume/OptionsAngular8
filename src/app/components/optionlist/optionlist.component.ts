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
  PutMonthSelected = false;
  showSpinner = false;
  RankCompleted=false;
  GraphLoaded= false;
  GraphLoading=false;
  sb ="";
  MonthsContracts = new Map<string, contracts[]>();
  PutMonthsContracts = new Map<string, contracts[]>();
  timePeriods = ["", "", ""];
  callExpDates = ["","",""];
  GraphDataLoading = true;
  SelectedContract = "";
  REC_DATA:any  = [];
  RANK_DATA= [];
  CONTRACT_DATA: contractParams[] = [
    {strike:1,code:"", expiration:new Date()},
  ];
  PUT_CONTRACT_DATA: contractParams[] = [
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

    this.pusherService.UpdateSubject.subscribe((message:any) => {
      console.log("updating...");
      if(this.CallMonthSelected || this.PutMonthSelected)
      {
        this.resetSelection('call');
        this.resetSelection('put');

      }
      this.RANK_DATA = message.rankhis;
      this.currentCompany = message.sym.symbol+"";
      this.pusherService.StockSubject.next({sym:this.currentCompany,request:0});

      //this.pusherService.StockSubject.messages.next({sym:})
      console.log(message.sym);
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
        i++;

      }
      i = 0;
      for(let months in message.puts)
      {
        var d2 = new Date((Date.now()));
        d2 = new Date(d2.setMonth(d2.getMonth()+i));
        this.timePeriods[i] =  this.MonthArray[d2.getMonth()];
        let ii = 0;
        let currentMonth =  message.puts[""+this.MonthArray[d2.getMonth()]];

        let ccp = [];
        for(let c in currentMonth)
        {
          //console.log(c[ii]);
          let ob = currentMonth;
          ccp.push({strike:parseFloat(ob[ii].strike),code:ob[ii].code,expiration:new Date(ob[ii].expiration + "")});
          ii++;

        }
        this.PutMonthsContracts.set(this.MonthArray[d2.getMonth()],ccp);
        this.PUT_CONTRACT_DATA = [];



        //console.log(message.calls[this.MonthArray[d.getMonth()]]);
        //console.log(this.CONTRACT_DATA);
        //this.timePeriods.push(this.MonthArray[d.getMonth()]);
        i++;

      }

      chart(this.rankRef.nativeElement, {

            xAxis: {
              type: 'datetime'
            },
            yAxis: {
                reversed: true
            },

            title: {
                text: this.currentCompany+' Rank History'
            },

            series: [{
              name: 'Rank',
              data: this.RANK_DATA,
              type:'line'
            }]
          });

        this.RankCompleted = true;
      console.log(message);

    });

    this.pusherService.InitialSubject.subscribe((message:any) => {
      console.log(message);
      let CurSym = message.ranks;
      this.RANK_DATA = message.rankhis;
      this.currentCompany = CurSym[0].symbol+"";
      this.pusherService.StockSubject.next({sym:this.currentCompany,request:0});

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



        //console.log(message.calls[this.MonthArray[d.getMonth()]]);
        //console.log(this.CONTRACT_DATA);
        //this.timePeriods.push(this.MonthArray[d.getMonth()]);
        i++;

      }
      i = 0;
      for(let months in message.puts)
      {
        var d2 = new Date((Date.now()));
        d2 = new Date(d2.setMonth(d2.getMonth()+i));
        this.timePeriods[i] =  this.MonthArray[d2.getMonth()];
        let ii = 0;
        let currentMonth =  message.puts[""+this.MonthArray[d2.getMonth()]];

        let ccp = [];
        for(let c in currentMonth)
        {
          //console.log(c[ii]);
          let ob = currentMonth;
          ccp.push({strike:parseFloat(ob[ii].strike),code:ob[ii].code,expiration:new Date(ob[ii].expiration + "")});
          ii++;

        }
        this.PutMonthsContracts.set(this.MonthArray[d2.getMonth()],ccp);
        this.PUT_CONTRACT_DATA = [];



        //console.log(message.calls[this.MonthArray[d.getMonth()]]);
        //console.log(this.CONTRACT_DATA);
        //this.timePeriods.push(this.MonthArray[d.getMonth()]);
        i++;

      }




      this.pusherService.SymbolSubject.next({symbol:this.currentCompany});
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
            title: {
                text: this.currentCompany+' Rank History'
            },

            series: [{
              name: 'Rank',
              data: this.RANK_DATA,
              type:'line'
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
        this.GraphLoading = false;
        this.GraphLoaded = true;

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
                text: this.currentCompany+' Options \n'+this.SelectedContract
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
  PutSelected(text:any)
  {
    this.PUT_CONTRACT_DATA = this.PutMonthsContracts.get(text);
    this.PutMonthSelected = true;

  }

  CallSelected(text:any)
  {
    this.CONTRACT_DATA = this.MonthsContracts.get(text);
    this.CallMonthSelected = true;
    this.showSpinner = true;
  }

  logThis(text:any,code:any)
  {
    console.log(text);
    console.log(code);
    this.SelectedContract = text;
    this.pusherService.messages.next({channel:this.pusherService.channel,"data":{code:(code+""),symbol:(this.currentCompany)},event:"client-GraphDataRequest"});
    this.GraphLoading = true;
    this.GraphLoaded = false;

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

  resetSelection(s:string){
    console.log(s);
    if(s == "call")
    {
      console.log("yess call");
      this.CallMonthSelected = false;
      this.showSpinner = false;

    }else{
      console.log("not call");
      this.PutMonthSelected = false;
    }
    this.GraphLoaded = false;


  }










}
