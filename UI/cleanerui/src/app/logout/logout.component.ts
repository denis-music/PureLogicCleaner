import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, private alertifyService: AlertifyService) { }

  ngOnInit(): void {
    localStorage.removeItem('user');
    this.alertifyService.warningAlert("Successfully Logged out!")
    this.router.navigate(['/home'])
  }

}
