import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './helpers/auth.guard';


import { HomeComponent } from './components/home/home.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { AuthenticationRequiredComponent } from './components/authentication-required/authentication-required.component';
import { WatchlistComponent  } from './components/watchlist/watchlist.component';



const routes: Routes = [
  {
      path: '',
      redirectTo: '/home',
      pathMatch: 'full',
  },
  {
      path: 'home',
      component: HomeComponent,
      canActivate: [AuthGuard]
  },
  {
      path: 'login',
      component: AuthenticationComponent,
  },
  {
      path: 'register',
      component: AuthenticationRequiredComponent ,
  },
  {
      path:'watchlist',
      component:WatchlistComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
