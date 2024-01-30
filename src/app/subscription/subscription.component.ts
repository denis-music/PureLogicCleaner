import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from './subscription.service';
import { Subscription } from '../model/subs.model';
import { UserService } from '../_services/user.service';
import { User } from '../model/users.model';


@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  constructor(private subsService: SubscriptionService,
    private userService: UserService) { }
  subscriptions: Subscription[] = [];

  userId = '';
  ngOnInit() {
    const item = localStorage.getItem('user');
    if (item) {
      const user: User[] = JSON.parse(item);
      this.userId = user[0].id;
    } else {
      this.userId = '';
    }
    this.loadData();
    this.loadMemberSub();
  }

  loadData() {
    this.subscriptions = [];
    this.subsService.getSubs().subscribe(
      (result) => {
        this.subscriptions = result;
      }
    )
  };

  userSubId: string = '';
  loadMemberSub() {
    this.userService.getUser().subscribe(
      (result) => {
        if (result !== null) {
          this.userSubId = result.subsId;
        }
      }
    )
  }

  loading: boolean = false;

  subscribe(subscription: Subscription) {
    this.loading = true;
    this.subsService.changeUserSub(subscription.id).subscribe(
      (result) => {
        this.loadMemberSub();
        this.loadData();
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.loading = false;
      }
    );
  }
}
