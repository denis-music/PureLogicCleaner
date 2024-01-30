import { Component, OnInit } from '@angular/core';
import { CleaningQuality } from '../enum/cleaningQuality.enum';
import { Router } from '@angular/router';
import { UserStateService } from '../_services/user-state.service';
import { CleaningHistoryService } from '../_services/cleaning-history.service';
import { CleaningHistoryCompletion } from '../model/cleaningHistoryCompletion.model';

@Component({
  selector: 'app-cleaning-history-completion',
  templateUrl: './cleaning-history-completion.component.html',
  styleUrls: ['./cleaning-history-completion.component.scss']
})
export class CleaningHistoryCompletionComponent implements OnInit {

  constructor(private router: Router, private sharedService: UserStateService,
    private cleaningHistoryService: CleaningHistoryService) { }

  cleaningQuality = CleaningQuality;
  cleaningQualityOptions!: { key: string; value: number; }[];

  ngOnInit(): void {
    this.cleaningQualityOptions = Object.entries(this.cleaningQuality)
      .filter(([key, value]) => !isNaN(Number(value)))
      .map(([key, value]) => ({ key, value: Number(value) }));
  }

  completionStatus = '';
  selectedCleaningQuality: any = 0;
  cleaningMinutes = 0;

  handleSubmit(form: any) {
    if (form.valid && this.cleaningMinutes != 0) {
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
              this.handleCancel();
            }
          )
      }
      else {
        this.cleaningHistoryService.saveCompletionInfo(cleaningId, model).subscribe(
          (room) => {
            console.log('Success saving data.');
            this.handleCancel()
          },
          (error) => {
            console.error('Error fetching data:', error);
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