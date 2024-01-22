import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsComponent } from './statistics/statistics.component';
const routes: Routes = [

  { path: 'statistics', component: StatisticsComponent },
  // { path: 'home', component: HomeComponent },
  // { path: 'about', component: AboutComponent },




  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to home page if no path specified
  { path: '**', redirectTo: '/home', pathMatch: 'full' }, // Redirect to home page if the URL doesn't match any route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
