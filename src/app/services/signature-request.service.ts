import { Injectable } from '@angular/core';
import { environment } from '../models/environment.models';
import { HttpClient } from '@angular/common/http';


export interface SignatureResponse
{
  auth:string;
}

export interface SignatureRequest
{
  name:string;
  socket_id:string;
}


@Injectable({
  providedIn: 'root'
})
export class SignatureRequestService {
  apiURL: string = "https://stocksymbols.azurewebsites.net/api/SignatureTrigger?code=znyU8hQUJY96rNT/AnqxJ2FpOZN56qkAatwtCLcYw3BeNjhQihzZzQ==";


  constructor(private httpClient: HttpClient) { }


  public createCustomer(req: SignatureRequest){
    return this.httpClient.post(`${this.apiURL}`,req);
  }





}
