import { Component, OnInit,ViewChild,HostListener, ElementRef,  } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {chart} from 'highcharts';
import {stockChart }from 'highcharts/highstock';
import { SAMPLE_DATA } from '../../helpers/stock-symbols';

@Component({
  selector: 'app-optionlist',
  templateUrl: './optionlist.component.html',
  styleUrls: ['./optionlist.component.scss']
})
export class OptionlistComponent implements OnInit {

  currentCompany = "APPL";
  charts!:any;
  @ViewChild('optionChart',{static:true}) chartRef!:ElementRef

  constructor() { }

  ngOnInit() {
  }
  timePeriods = [
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century',
    'Early modern period',
    'Long nineteenth century',
    'Early modern period',
    'Long nineteenth century'
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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
  }

  logThis(text:any)
  {
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
    });
  }

}
