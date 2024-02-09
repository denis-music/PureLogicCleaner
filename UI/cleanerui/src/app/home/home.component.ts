import { Component, OnInit } from '@angular/core';
import { SharedStateService } from '../_services/shared-state.service';
import { AlertifyService } from '../_services/alertify.service';
import { User } from '../model/users.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private sharedStateService: SharedStateService,
    private alertifyService: AlertifyService) { }

  userHasSubsciption: boolean | null | undefined;

  ngOnInit(): void {
    this.sharedStateService.userWSubs.subscribe(value => {
      this.userHasSubsciption = value;
    });
    const item = localStorage.getItem('user');
    if (item) {
      const users: User[] = JSON.parse(item);
      var user = users[0];

      if (user && !this.userHasSubsciption) {
        this.alertifyService.warningAlert("Your supscription has ended. Please subscribe!")
      }
    }
  }

  openConfiguration(){
    window.open("../../assets/img/User-manual-PureLogic-Cleaner-Final.pdf",'_blank');
  }


}
