import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Symbols } from '../helpers/stock-symbols';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  searchOption=[]
  public postsData: Symbols[]
  postUrl : string = "https://stocksymbols.azurewebsites.net/api/HttpTrigger1?code=9Ltms8qZ5IWQCQDH4/zPzEBvWJAblX3Dgwo5D3jRU31EHaSlAfqK4A==";

  constructor(private http:HttpClient) { }

  getSymbols():Observable<Symbols[]>{
    return this.http.get<Symbols[]>(this.postUrl)
  }
}
