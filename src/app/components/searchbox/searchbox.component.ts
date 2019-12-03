import {Component, ElementRef, OnInit, SecurityContext, ViewChild} from '@angular/core';
import {MatAutocompleteTrigger,  MatOptionSelectionChange} from '@angular/material';

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
  @ViewChild('searchBox',{static:false}) searchInputElement!: ElementRef;
  @ViewChild(MatAutocompleteTrigger,{static:false});
  autocompleteTrigger!: MatAutocompleteTrigger;
  filteredOptions: Observable<string[]>;
  allPosts: Symbols[];
  autoCompleteList: any[]


  constructor(
    private readonly searchService: SearchService,

  ) { }

  ngOnInit() {
    this.searchService.getSymbols().subscribe(posts => {
            this.allPosts = posts

        });
    //this.searchService.searchText.subscribe(query => this.searchText = query);
  }

    /**
   * Updates the search text on the search box service.
   * @param query the query to be updated for the search text.
   */
  updateSearchText(query: string) {
    this.autoCompleteExpenseList(query);
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
                this.dataService.searchOption = []
            }
            else {

                this.dataService.searchOption.push(posts);
                this.onSelectedOption.emit(this.dataService.searchOption)
            }
            this.focusOnPlaceInput();
        }

        removeOption(option) {

          let index = this.dataService.searchOption.indexOf(option);
          if (index >= 0)
              this.dataService.searchOption.splice(index, 1);
          this.focusOnPlaceInput();

          this.onSelectedOption.emit(this.dataService.searchOption)
      }

      // focus the input field and remove any unwanted text.
      focusOnPlaceInput() {
          this.autocompleteInput.nativeElement.focus();
          this.autocompleteInput.nativeElement.value = '';
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
    if (event.isUserInput) console.log(model +"selected!");
  }


}
