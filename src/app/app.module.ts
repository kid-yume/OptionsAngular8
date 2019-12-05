import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { CustomMaterialModule } from './core/material-module/material-module.module';
import {FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { AuthenticationRequiredComponent } from './components/authentication-required/authentication-required.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { SearchboxComponent } from './components/searchbox/searchbox.component';
import { OptionlistComponent } from './components/optionlist/optionlist.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthenticationComponent,
    AuthenticationRequiredComponent,
    WatchlistComponent,
    SearchboxComponent,
    OptionlistComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CustomMaterialModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
