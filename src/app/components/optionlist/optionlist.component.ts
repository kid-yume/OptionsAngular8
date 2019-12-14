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
  MonthsContracts = new Map<string, contracts[]>();
  timePeriods = ["", "", ""];
  callExpDates = ["","",""];
  CONTRACT_DATA: contractParams[] = [
    {strike:1,code:"", expirationDate:new Date()},
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

  constructor(private pusherService: PusherService) { }

  ngOnInit() {
    this.pusherService.InitialSubject.subscribe((message:any) => {
      console.log(message);

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
      console.log("dict\n")
      console.log(this.MonthsContracts);
      //console.log(message.calls["December"]);
      /*for (call in message.calls)
      {
        timePeriods.push(call.)
      }*/

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
  }

  logThis(text:any,code:any)
  {
    //console.log(text,code);
    console.log(code);

    /*
    this.CallMonthSelected = true;
    stockChart(this.chartRef.nativeElement, {


        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Options'
        },

        series: [{
            type: 'candlestick',
            name: 'AAPL Stock Price',
            data: SAMPLE_DATA,
            dataGrouping: {
                units: [
                    [
                        'week', // unit name
                        [1] // allowed multiples
                    ], [
                        'month',
                        [1, 2, 3, 4, 6]
                    ]
                ]
            }
        }]
    });*/
  }

}
