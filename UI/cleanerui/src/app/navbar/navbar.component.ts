import { Component, OnInit } from '@angular/core';
import { User } from '../model/users.model';
import { Router } from '@angular/router';

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

  userId = '';
  ngOnInit() {
    const item = localStorage.getItem('user');
    if (item) {
      const user: User[] = JSON.parse(item);
      this.userId = user[0].id;
    } else {
      this.userId = '';
    }
  }
}
