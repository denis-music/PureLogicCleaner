import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from './subscription.service';
import { Subscription } from '../model/subs.model';
import { error } from 'console';


@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  constructor(private subsService: SubscriptionService) { }
  subscriptions: Subscription[] = [];
  
  ngOnInit() {
    this.loadData();
    this.loadMemberSub();
  }

  loadData()  {
    this.subscriptions = [];
    this.subsService.getSubs().subscribe(
      (result)=> {
        this.subscriptions = result;
      }
    )};

    userSubId: string = '';
    userId: string = "d55bd14c-c380-42d5-a9c6-aa1c0b050804";
    loadMemberSub(){
      this.subsService.getUserSub(this.userId).subscribe (
        (result) => {
          this.userSubId = result.subsId;
          console.log(this.userSubId);
        }
      )
    }

    loading: boolean = false;
    subscribe(subscription: Subscription){
      this.loading = true;
      this.subsService.changeUserSub(this.userId, subscription.id).subscribe(
        (result) => {
          console.log("nice");
          this.loadMemberSub();
          this.loadData();
          this.loading = false; // Set loading to false on success
        },
        (error) => {
          console.error('Error fetching data:', error);
          this.loading = false; // Set loading to false on error
        }
      );
    }
}
