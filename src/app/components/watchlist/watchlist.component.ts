import { Component, OnInit, ChangeDetectorRef, ViewChild  } from '@angular/core';
import { PusherService } from '../../services/pusher.service';
import { MatDialog, MatTable } from '@angular/material';

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
  sb = "";
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

  @ViewChild("myTable",{static:true}) table: MatTable<any>;


  constructor(private pusherService: PusherService,
              private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {
    console.log("I rna on Init");
    this.pusherService.InitialSubject.subscribe((message:any) => {
      let r = [];
      let test = message.ranks;
      let loop = 0;
      console.log(test[0].symbol);
      for(let rank in message.ranks)
      {
        //console.log(rank.rank);
        r.push({ranking:test[loop].rank,companyName:test[loop].symbol,totalChange:test[loop].change})
        loop++;
      }
      //this.RANKING_DATA = r;
      this.rankingDataSource = r;
      console.log(r);

      //this.table.renderRows();
      //this.changeDetectorRefs.detectChanges();

    });
    this.pusherService.messages.next({channel:this.pusherService.channel,"data":{},event:"client-InitialStartup"});
    this.pusherService.HomeSubject.subscribe((message:any) => {
    let convertS = ""+message;
    this.sb+= convertS.substring(0,message.length-1);
    //this.sb = this.CleanMessage(this.sb);
    //console.log(this.sb);
    if(this.sb.indexOf("!ENDOFMESSAGE") != -1)
    {
      //console.log("before \n"+this.sb);
      this.sb =this.CleanMessage(this.sb);
      //console.log("after \n"+this.sb);
      let test = JSON.parse(this.sb);
      let enumerableKeys = [];
      for (let key in test) {
        enumerableKeys.push(key);
      }
      for(let show in enumerableKeys)
      {
        //console.log(show);
      }
      console.log(enumerableKeys);
      console.log(test);
      this.pusherService.InitialSubject.next({ranks:test.ranks,calls:test.calls,puts:test.puts});


      /*
      let test = JSON.parse(this.sb);

      this.sb = this.sb.replace("!ENDOFMESSAGE",'');
      //console.log();
      localStorage.setItem('user', JSON.stringify(this.sb));

      let test = JSON.parse(this.sb);
      test = JSON.parse(this.sb);
      //console.log(JSON.stringify(test));
      let enumerableKeys = [];
      for (let key in test) {
        enumerableKeys.push(key);
      }
      for(let show in enumerableKeys)
      {
        //console.log(show);
      }
      console.log(enumerableKeys);
      //enumerableKeys;
      //console.log("rank"+test["ranks"])
      console.log("At End of mdssage"+test["0"]);
      */

    }




    });

  }
  private toUTF8Array(str):any {
    var utf8 = [];
    for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6),
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12),
                      0x80 | ((charcode>>6) & 0x3f),
                      0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >>18),
                      0x80 | ((charcode>>12) & 0x3f),
                      0x80 | ((charcode>>6) & 0x3f),
                      0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
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
  returns = message.replace("\"chunk\":\"{\\\"ranks\\\"","\"ranks\"");
  returns= returns.replace("\"{\"chunk\":\"", '');
  returns = returns.replace(/\"{\"chunk\":\"/g,'');
  returns= returns.replace(/\\/g, '');
  returns = returns.replace("!ENDOFMESSAGE \"",'');

  //console.log("fired");
  return returns;
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
  async SelectRankList(x:MatTable)
  {
      x.renderRows();
    if(this.selected == 0)
    {
      console.log("fired");
      this.selected = 1;
      this.buttonColor="accent";
      this.rankButtonColor ="primary";

    }
  }







}
