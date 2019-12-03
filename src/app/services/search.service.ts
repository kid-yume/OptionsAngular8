import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Symbols } from '../../helpers/stock-symbols';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  searchOption=[]
  public postsData: Post[]
  postUrl : string = "https://jsonplaceholder.typicode.com/posts";

  constructor(private http:HttpClient) { }

  getSymbols():Observable<Symbols[]>{
    reutn this.http.get<Symbols[]>(this.postUrl)
  }
}
