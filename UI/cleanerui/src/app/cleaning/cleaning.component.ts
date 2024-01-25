import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../statistics/statistics.service';
import { CleaningHistory } from '../model/cleaningHistory.model';
import { RoomService } from '../_services/room.service';
import { CleaningHistoryWithName } from '../model/cleaningHistoryWithName.model';

@Component({
  selector: 'app-cleaning',
  templateUrl: './cleaning.component.html',
  styleUrls: ['./cleaning.component.scss']
})
export class CleaningComponent implements OnInit {

  constructor(private statisticsService: StatisticsService,
    private roomService: RoomService) { }

  showWaitingMessage = false;
  cleaningHistoryList: CleaningHistory[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.cleaningHistoryList = [];
    this.statisticsService.getCleaningsForMemberByMutalRoomId().subscribe(
      (data) => {
        if (data !== null) {
          this.cleaningHistoryList = data;
          this.splitHistoryLists();
        } else {
          console.error('There is no data');
        }
      },
      (error) => {
        console.error('Error fetching API results:', error);
      });
  }

  pastCleaningHistoryList: CleaningHistory[] = [];
  futureCleaningHistoryList: CleaningHistoryWithName[] = [];
  splitHistoryLists(): void {
    this.pastCleaningHistoryList = [];
    this.futureCleaningHistoryList = [];
    const today = new Date();

    this.cleaningHistoryList.forEach((item) => {
      const itemDate = new Date(item.date);


      this.roomService.getRoomById(item.userRoomId).subscribe(
        (room) => {
          if (room !== null) {
            var itemWName = new CleaningHistoryWithName(
              item.id, item.userRoomId,
              room.name, item.completed,
              item.cleaningQuality, item.cleaningDurationInMins,
              item.date, item.createdAt, item.updatedAt
            )
            if (itemDate <= today) {
              // Date is today or in the past
              this.pastCleaningHistoryList.push(itemWName);
            } else if (itemDate > today) {
              // Date is in the future
              this.futureCleaningHistoryList.push(itemWName);
            }
          }
        }
      );
    });
  }

  onButtonClick(cleaning: CleaningHistory) {
    this.showWaitingMessage = true;

    this.statisticsService.changeCleaningStatus(cleaning.id).subscribe(
      (result) => {
        this.loadData();
        this.showWaitingMessage = false;
      }, (error) => {
        this.showWaitingMessage = false;
      });
  }

}
