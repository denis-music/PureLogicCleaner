import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserComponent } from './user/user.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { MyComponentComponent } from './my-component/my-component.component';
import { StatisticsComponent } from './statistics/statistics.component';

@NgModule({
  declarations: [			
    AppComponent,
      NavbarComponent,
      UserComponent,
      SubscriptionComponent,
      MyComponentComponent,
      StatisticsComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
