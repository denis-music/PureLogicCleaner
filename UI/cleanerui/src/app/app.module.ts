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
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { FeedbacksComponent } from './feedback/feedbacks.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CleaningComponent } from './cleaning/cleaning.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HabitComponent } from './habit/habit.component';
import { LogoutComponent } from './logout/logout.component';

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
      LogoutComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
