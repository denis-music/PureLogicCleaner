import { Component, OnInit, Type } from '@angular/core';
import { FeedbacksService } from './feedbacks.service';
import { Feedback } from '../model/feedback.model';
import { FeedbackType } from '../enum/feedbackType.enum';
import { StatisticsService } from '../statistics/statistics.service';
import { RoomDate } from '../model/roomDate.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss']
})
export class FeedbacksComponent implements OnInit {
  cleaningHistoryId: string = '';
  text: string = '';
  ratingError: string = '';

  selectedFeedbackType: any = 0; // This will hold the selected value
  feedbackType = FeedbackType;
  feedbackTypeOptions: { key: string, value: number }[];
  selectedCleaningType: string = '';

  rating: number = 0;
  feedbackText: string = '';

  showForm: boolean = true;
  constructor(private feedbackService: FeedbacksService,
    private statisticsService: StatisticsService, private router: Router,
    private snackBar: MatSnackBar) 
    {
  this.feedbackTypeOptions = Object.entries(this.feedbackType)
  .filter(([key, value]) => !isNaN(Number(value)))
  .map(([key, value]) => ({ key, value: Number(value) }));
  }

  optionList: RoomDate[] = [];
  ngOnInit(): void {
    this.statisticsService.getCleaningStatus().subscribe(
      (data) => {
        data.forEach ((item) => {
          this.optionList.push(new RoomDate(item.userRoomId, item.id, item.date));
        });
      },
      (error) => {
        console.error('Error fetching API results:', error);
      });
  }

    saveFeedback(): void {
    console.log(this.selectedCleaningType);
    let feedbackTypeNumber = parseInt(this.selectedFeedbackType, 10);

    const feedback = new Feedback(this.selectedCleaningType, feedbackTypeNumber,
    this.rating, this.feedbackText);
    feedback.memberId = "d55bd14c-c380-42d5-a9c6-aa1c0b050804";

    // Make a POST request to the API endpoint
    this.feedbackService.saveFeedback(feedback).subscribe(
      response => {
        this.snackBar.open('Feedback submitted successfully!', 'Close', {
          duration: 5000, // Duration in milliseconds
        });
        this.showForm = false;
      },
      error => {
        console.error('Error submitting feedback:', error);
      }
    );
  }

    showPopup() {
      this.showForm = true;
  }
}