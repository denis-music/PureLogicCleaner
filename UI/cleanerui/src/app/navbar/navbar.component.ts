import { Component, OnInit } from '@angular/core';
import { User } from '../model/users.model';
import { NavigationEnd, Router } from '@angular/router';
import { UserStateService } from '../_services/user-state.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router, private userStateService: UserStateService) { }
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
  userWHabist = true;
  ngOnInit() {
    this.userStateService.userWHabits.subscribe(value => {
      this.showNavbarHabits = value;
    });

    const item = localStorage.getItem('user');
    if (item) {
      const users: User[] = JSON.parse(item);
      var user = users[0];
      this.userId = user.id;
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
