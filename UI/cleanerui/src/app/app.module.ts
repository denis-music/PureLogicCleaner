import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserComponent } from './user/user.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FeedbacksComponent } from './feedback/feedbacks.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CleaningComponent } from './cleaning/cleaning.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HabitComponent } from './habit/habit.component';
import { LogoutComponent } from './logout/logout.component';
import { CompaniesComponent } from './companies/companies.component';
import { CleaningHistoryCompletionComponent } from './cleaning-history-completion/cleaning-history-completion.component';
import { AlertifyService } from './_services/alertify.service';
import { NgChartsModule } from 'ng2-charts';
import { UserLandingComponent } from './user-landing/user-landing.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    UserComponent,
    SubscriptionComponent,
    StatisticsComponent,
    FeedbacksComponent,
    HomeComponent,
    CleaningComponent,
    LoginComponent,
    CleaningComponent,
    RegisterComponent,
    HabitComponent,
    LogoutComponent,
    CompaniesComponent,
    CleaningHistoryCompletionComponent,
    UserLandingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgChartsModule,
    BrowserAnimationsModule
  ],
  providers: [
    AlertifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
