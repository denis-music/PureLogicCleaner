import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsComponent } from './statistics/statistics.component';
import { FeedbacksComponent } from './feedback/feedbacks.component';
import { HomeComponent } from './home/home.component';
import { CleaningComponent } from './cleaning/cleaning.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HabitComponent } from './habit/habit.component';
import { LogoutComponent } from './logout/logout.component';
import { CompaniesComponent } from './companies/companies.component';
import { CleaningHistoryCompletionComponent } from './cleaning-history-completion/cleaning-history-completion.component';

const routes: Routes = [
  { path: 'statistics', component: StatisticsComponent },
  { path: 'feedbacks', component: FeedbacksComponent },
  { path: 'cleaning', component: CleaningComponent },
  { path: 'subs', component: SubscriptionComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'habit', component: HabitComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: 'completeInfo', component: CleaningHistoryCompletionComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to home page if no path specified
  { path: '**', redirectTo: '/home', pathMatch: 'full' }, // Redirect to home page if the URL doesn't match any route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
