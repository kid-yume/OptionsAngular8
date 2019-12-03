import { Component, OnInit } from '@angular/core';


export interface WatchListItem {
  contract:string;
  strike_price:number;
  price:number;

}

export interface RankingItem {
  ranking:number;
  companyName:string;
  totalChange:number;

}

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {


  buttonColor = "primary";
  rankButtonColor ="acent";
  selected = 0;
  WATCHLIST_DATA: WatchListItem[] = [
    {contract:'December 12',strike_price:39, price:0.40},
    {contract:'December 12',strike_price:39, price:0.40},
    {contract:'December 12',strike_price:39, price:0.40},
    {contract:'December 12',strike_price:39, price:0.40},
    {contract:'December 12',strike_price:39, price:0.40}
  ];

  RANKING_DATA:RankingItem[] = [
    {ranking:1, companyName:"Apple",totalChange:-10},
    {ranking:2,companyName:"Google", totalChange:-120},
    {ranking:3, companyName:"Nvidia",totalChange:10},
    {ranking:4,companyName:"Bottom Feeders", totalChange:30},

  ];


  watchListDisplayedColumns: string[] = ['contract','strike_price','price'];
  rankingDisplayedColumns: string[] = ['No.',"Company Name", "Total Change"]

  watchListDataSource = this.WATCHLIST_DATA;
  rankingDataSource = this.RANKING_DATA;



  constructor() { }

  ngOnInit() {
  }

  async SelectWatchList()
  {
    if(this.selected == 1)
    {
      console.log("fired watch")
      this.selected = 0;
      this.buttonColor="primary";
      this.rankButtonColor ="accent";

    }

  }
  async SelectRankList()
  {
    if(this.selected == 0)
    {
      console.log("fired");
      this.selected = 1;
      this.buttonColor="accent";
      this.rankButtonColor ="primary";

    }
  }







}
