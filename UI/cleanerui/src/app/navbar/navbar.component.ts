import { Component, OnInit } from '@angular/core';
import { User } from '../model/users.model';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router) { }

  logout() {
    this.router.navigate(['/logout']).then(() => {
      location.reload();
    });
  }

  showNavbarHabits: boolean = true;
  showNavbarLogin: boolean = true;
  showNavbarReg: boolean = true;
  userId = '';
  ngOnInit() {
    const item = localStorage.getItem('user');
    if (item) {
      const user: User[] = JSON.parse(item);
      this.userId = user[0].id;
    } else {
      this.userId = '';
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
