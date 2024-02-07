import { Component, OnInit } from '@angular/core';
import { CleaningQuality } from '../enum/cleaningQuality.enum';
import { Router } from '@angular/router';
import { SharedStateService } from '../_services/shared-state.service';
import { CleaningHistoryService } from '../_services/cleaning-history.service';
import { CleaningHistoryCompletion } from '../model/cleaningHistoryCompletion.model';
import { AlertifyService } from '../_services/alertify.service';
import { User } from '../model/users.model';

@Component({
  selector: 'app-cleaning-history-completion',
  templateUrl: './cleaning-history-completion.component.html',
  styleUrls: ['./cleaning-history-completion.component.scss']
})
export class CleaningHistoryCompletionComponent implements OnInit {

  constructor(private router: Router, private sharedService: SharedStateService,
    private cleaningHistoryService: CleaningHistoryService,
    private alertifyService: AlertifyService
  ) { }

  cleaningQuality = CleaningQuality;
  cleaningQualityOptions!: { key: string; value: number; }[];
  isLogIn: boolean = true;

  ngOnInit(): void {
    this.cleaningQualityOptions = Object.entries(this.cleaningQuality)
      .filter(([key, value]) => !isNaN(Number(value)))
      .map(([key, value]) => ({ key, value: Number(value) }));

    const item = localStorage.getItem('user');
    if (item) {
      const users: User[] = JSON.parse(item);
      var user = users[0];
      if (user != null && user.username != '') {
        this.isLogIn = true;
      } else {
        this.isLogIn = false;
      }
    } else {
      this.isLogIn = false;
    }
  }

  completionStatus: string = '';
  selectedCleaningQuality: any = 0;
  cleaningMinutes = 0;
  showWaitingMessage = false;

  handleSubmit(form: any) {
    this.showWaitingMessage = true;
    if (form.valid) {
      var cleaningId: string = ''
      this.sharedService.currentCleaningId.subscribe(id => {
        cleaningId = id!;
      });
      var model = new CleaningHistoryCompletion(
        this.completionStatus == "yes" ? true : false,
        parseInt(this.selectedCleaningQuality, 10),
        this.cleaningMinutes
      )

      if (model.Completed == false) {
        this.cleaningHistoryService.setUncompletedStatus(cleaningId).subscribe(
          (result) => {
            this.alertifyService.successAlert("Completion Saved!")
            this.showWaitingMessage = false;

            this.handleCancel();
          }
        )
      }
      else {
        this.cleaningHistoryService.saveCompletionInfo(cleaningId, model).subscribe(
          (room) => {
            this.alertifyService.successAlert("Completion Saved!")
            this.showWaitingMessage = false;

            this.handleCancel()
          },
          (error) => {
            this.alertifyService.errorAlert("Error saving completion, please try later!")
            this.showWaitingMessage = false;

          }
        )
      }
    } else {
      console.log('Form is not valid');
    }
  }

  handleCancel() {
    this.router.navigate(["/cleaning"])
  }
}
