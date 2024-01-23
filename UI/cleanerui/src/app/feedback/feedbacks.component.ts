import { Component, OnInit, Type } from '@angular/core';
import { FeedbacksService } from './feedbacks.service';
import { Feedback } from '../model/feedback.model';
import { FeedbackType } from '../enum/feedbackType.enum';
import { StatisticsComponent } from '../statistics/statistics.component';
import { StatisticsService } from '../statistics/statistics.service';
import { CleaningHistory } from '../model/cleaningHistory.model';
import { RoomDate } from '../model/roomDate.model';
import { Router } from '@angular/router';

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

  constructor(private feedbackService: FeedbacksService,
    private statisticsService: StatisticsService, private router: Router) {
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
        console.log('Feedback submitted successfully!', response);
            // Navigate to home page TO DO
      },
      error => {
        console.error('Error submitting feedback:', error);
      }
    );
  }
}
