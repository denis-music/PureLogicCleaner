import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from './subscription.service';
import { Subscription } from '../model/subs.model';
import { UserService } from '../_services/user.service';
import { User } from '../model/users.model';
import { AlertifyService } from '../_services/alertify.service';
import { SharedStateService } from '../_services/shared-state.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  constructor(private subsService: SubscriptionService,
    private userService: UserService,
    private alertifyService: AlertifyService,
    private sharedStateService: SharedStateService,
    private authService: AuthService) { }
  subscriptions: Subscription[] = [];

  userId = '';
  isLogIn: boolean = true;
  user: User | undefined;
  userSubs: Subscription | undefined;
  ngOnInit() {
    const item = localStorage.getItem('user');
    if (item) {
      const user: User[] = JSON.parse(item);
      this.user = user[0]
      this.userId = user[0].id;
      this.isLogIn = true;
    } else {
      this.userId = '';
      this.isLogIn = false;
    }
    this.loadData();
    this.loadMemberSub();
  }

  loadData() {
    this.subscriptions = [];
    this.subsService.getSubs().subscribe(
      (result) => {
        this.userSubs = result.find(subscription => subscription.id === this.user?.subsId);
        this.subscriptions = result
          .filter(subscription => subscription.name !== 'Free Trial');
      }
    )
  };

  userSubId: string = '';
  loadMemberSub() {
    this.userService.getUserById().subscribe(
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
        this.authService.saveUser(this.user!.username);
        this.alertifyService.successAlert("Subscription Added!")
        this.sharedStateService.setUserWSubs(true);
        this.loadMemberSub();
        this.loadData();
        this.loading = false;
      },
      (error) => {
        this.alertifyService.errorAlert("Error Adding Subscription!")
        console.error('Error fetching data:', error);
        this.loading = false;
      }
    );
  }
}
