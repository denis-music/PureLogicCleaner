import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsComponent } from './statistics/statistics.component';
import { FeedbacksComponent } from './feedback/feedbacks.component';
import { HomeComponent } from './home/home.component';
import { CleaningComponent } from './cleaning/cleaning.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'statistics', component: StatisticsComponent },
  { path: 'feedbacks', component: FeedbacksComponent },
  { path: 'cleaning', component: CleaningComponent },
  { path: 'subs', component: SubscriptionComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to home page if no path specified
  { path: '**', redirectTo: '/home', pathMatch: 'full' }, // Redirect to home page if the URL doesn't match any route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
