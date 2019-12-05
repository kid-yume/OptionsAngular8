import {Component, ElementRef, OnInit, SecurityContext, ViewChild} from '@angular/core';
import {MatAutocompleteTrigger,  MatOptionSelectionChange} from '@angular/material';
import {FormControl} from '@angular/forms';
import { Observable } from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import { Symbols } from '../../helpers/stock-symbols';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.scss']
})
export class SearchboxComponent implements OnInit {
  isFocused!: boolean;
  searchText!: string;
  hidden = true;
  myControl = new FormControl();
  @ViewChild('searchBox',{static:false}) searchInputElement!: ElementRef;
  @ViewChild(MatAutocompleteTrigger,{static:false}) autocompleteTrigger!: MatAutocompleteTrigger;
  filteredOptions: Observable<string[]>;
  allPosts: Symbols[];
  autoCompleteList: any[]


  constructor(
    private readonly searchService: SearchService,

  ) { }

  ngOnInit() {
    this.searchService.getSymbols().subscribe(posts => {
            this.allPosts = posts
            this.hidden = false;
            console.log("posts:"+this.allPosts[0].symbol);

        });
        // when user types something in input, the value changes will come through this
          this.myControl.valueChanges.subscribe(userInput => {
              this.autoCompleteExpenseList(userInput);
          })

    //this.searchService.searchText.subscribe(query => this.searchText = query);
  }

    /**
   * Updates the search text on the search box service.
   * @param query the query to be updated for the search text.
   */
  updateSearchText(query: string) {
    //this.autoCompleteExpenseList(query);
  }

  private autoCompleteExpenseList(input) {
        let categoryList = this.filterCategoryList(input)
        this.autoCompleteList = categoryList;
    }

  // this is where filtering the data happens according to you typed value
  filterCategoryList(val) {
          var categoryList = []
          if (typeof val != "string") {
              return [];
          }
          if (val === '' || val === null) {
              return [];
          }
          return val ? this.allPosts.filter(s => s.symbol.toLowerCase().indexOf(val.toLowerCase()) != -1)
              : this.allPosts;
      }

  filterPostList(event) {
            var posts = event.source.value;
            if (!posts) {
                this.searchService.searchOption = []
            }
            else {

                this.searchService.searchOption.push(posts);
                //this.onSelectedOption.emit(this.searchService.searchOption)
            }
            this.focusOnPlaceInput();
        }

        removeOption(option) {

          let index = this.searchService.searchOption.indexOf(option);
          if (index >= 0)
              this.searchService.searchOption.splice(index, 1);
          this.focusOnPlaceInput();

          //this.onSelectedOption.emit(this.searchService.searchOption)
      }

      // focus the input field and remove any unwanted text.
      focusOnPlaceInput() {
          this.searchInputElement.nativeElement.focus();
          this.searchInputElement.nativeElement.value = '';
   }
   /**
   * Forwards the search request to the results component.
   * @param model represents the model (device/shelf/user) to search through.
   */
  search(model: string) {
  console.log("after pressing enter:"+model)
  }

      /**
   * Represents the action to take when a search type has been selected from
   * the autocomplete selection.
   * @param event represents the onSelectionChanges event.
   * @param model represents the type of search to be executed.
   */
  searchTypeSelected(event: MatOptionSelectionChange, model: string) {
    if (event.isUserInput)
    {
      this.searchInputElement.nativeElement.value = model;
      console.log(model +"selected!");
    }
  }


}
