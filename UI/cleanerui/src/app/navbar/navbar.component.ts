import { Component, OnInit } from '@angular/core';
import { User } from '../model/users.model';
import { NavigationEnd, Router } from '@angular/router';
import { SharedStateService } from '../_services/shared-state.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router, private sharedStateService: SharedStateService) { }
  showNavbar: boolean = false;

  toggleNavbar() {
      this.showNavbar = !this.showNavbar;
  }
  logout() {
    this.router.navigate(['/logout']).then(() => {
      location.reload();
    });
  }

  showNavbarHabits: boolean = true;
  showNavbarLogin: boolean = true;
  showNavbarReg: boolean = true;
  userId = '';
  userHasSubsciption = true;
  userWHabist = true;

  ngOnInit() {
    this.sharedStateService.userWHabits.subscribe(value => {
      this.showNavbarHabits = value;
    });

    this.sharedStateService.userWSubs.subscribe(value => {
      this.userHasSubsciption = value;
    });

    const item = localStorage.getItem('user');
    if (item) {
      const users: User[] = JSON.parse(item);
      var user = users[0];
      this.userId = user.id;
      if (user.subscriptionDaysLeft != null && 
        user.subscriptionDays != null &&
        user.subscriptionDaysLeft > user.subscriptionDays) {
          this.userHasSubsciption = false;
          this.sharedStateService.setUserWSubs(false);
      } else {
        this.userHasSubsciption = true;
        this.sharedStateService.setUserWSubs(true);
      }

      if (user.preferredCleaningDays == null ||
        user.preferredCleaningFrequency == null ||
        user.allergies == null || user.pets == null ||
        user.priorityRoomIds == null ||
        user.priorityRoomIds.length === 0 ||
        user.preferredCleaningDays.length === 0) {
          this.userWHabist = false;
        }
        else {
          this.userWHabist = true;
        }
    } else {
      this.userId = '';
      this.userWHabist = false;
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNavbarHabits = !(event.url === '/habit');
        this.showNavbarLogin = !(event.url === '/login');
        this.showNavbarReg = !(event.url === '/register');
      }
    });
  }
}
