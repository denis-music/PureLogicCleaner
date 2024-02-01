import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FeedbacksService } from './feedbacks.service';
import { StatisticsService } from '../statistics/statistics.service';
import { RoomService } from '../_services/room.service';
import { UserRoomsService } from '../_services/user-rooms.service';
import { RoomDate } from '../model/roomDate.model';
import { Feedback } from '../model/feedback.model';
import { FeedbackType } from '../enum/feedbackType.enum';
import { Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss']
})
export class FeedbacksComponent implements OnInit {
  @ViewChild('feedbackForm', { static: false }) feedbackForm: NgForm | undefined;

  optionList: RoomDate[] = [];
  cleaningHistoryId: string = '';
  text: string = '';
  ratingError: string = '';

  selectedFeedbackType: any = 0;
  feedbackType = FeedbackType;
  feedbackTypeOptions: { key: string, value: number }[];
  selectedCleaningType: string = '';

  rating: number = 0;
  feedbackText: string = '';
  showForm: boolean = true;
  isSubmitting: boolean = false;
  feedbackSubmitted: boolean = false;

  constructor(
    private feedbackService: FeedbacksService,
    private statisticsService: StatisticsService,
    private router: Router,
    private roomService: RoomService,
    private userRoomService: UserRoomsService,
    private alertifyService: AlertifyService
  ) {
    this.feedbackTypeOptions = Object.entries(this.feedbackType)
      .filter(([key, value]) => !isNaN(Number(value)))
      .map(([key, value]) => ({ key, value: Number(value) }));
  }

  ngOnInit(): void {
    this.selectedFeedbackType = ''
    this.loadOptionList();
  }

  loadOptionList(): void {
    this.statisticsService.getCleaningsForMemberByMutalRoomId().subscribe(
      (data) => {
        if (data !== null) {
          data.forEach((item) => {
            if (item) {
              this.userRoomService.getUserRoomById(item.userRoomId).subscribe(
                (userRoom) => {
                  this.roomService.getRoomById(userRoom!.roomId!).subscribe(
                    (room) => {
                      if (room !== null) {
                        this.optionList.push(new RoomDate(item.userRoomId, room.customName, item.id, item.date));
                      }
                    });
                });
            }
          });
        } else {
          console.error('There is no data.');
        }
      },
      (error) => {
        console.error('Error fetching API results:', error);
      });
  }

  saveFeedback(): void {
    let feedbackTypeNumber = parseInt(this.selectedFeedbackType, 10);

    const feedback = new Feedback(this.selectedCleaningType, feedbackTypeNumber,
      this.rating, this.feedbackText);

    this.isSubmitting = true;
    this.feedbackService.saveFeedback(feedback).subscribe(
      response => {
        this.showForm = false;
        if (this.feedbackForm) {
          this.feedbackForm.resetForm();
        }
        this.isSubmitting = false;
        this.feedbackSubmitted = true;
        this.alertifyService.successAlert("Feedback Added!")
      },
      error => {
        console.error('Error submitting feedback:', error);
        this.alertifyService.errorAlert("Error submitting feedback, try again!")

      }
    );
  }

  showPopup() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    if (this.feedbackForm) {
      this.feedbackForm.resetForm();
    }
    this.router.navigate(['/home']);
  }

  submitAnotherFeedback() {
    if (this.feedbackForm) {
      this.feedbackForm.resetForm();
    }
    this.isSubmitting = false;
    this.showForm = true;
    this.feedbackSubmitted = false;
    this.selectedCleaningType = ''
    this.selectedFeedbackType = ''
  }
}
