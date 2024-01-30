import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../statistics/statistics.service';
import { CleaningHistory } from '../model/cleaningHistory.model';
import { RoomService } from '../_services/room.service';
import { CleaningHistoryWithName } from '../model/cleaningHistoryWithName.model';
import { Router } from '@angular/router';
import { UserStateService } from '../_services/user-state.service';
import { getCleaningQualityName } from '../enum/cleaningQuality.enum';

@Component({
  selector: 'app-cleaning',
  templateUrl: './cleaning.component.html',
  styleUrls: ['./cleaning.component.scss']
})
export class CleaningComponent implements OnInit {

  constructor(private statisticsService: StatisticsService,
    private roomService: RoomService, private router: Router,
    private sharedService: UserStateService) { }

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

  pastCleaningHistoryList: CleaningHistoryWithName[] = [];
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
              getCleaningQualityName(item.cleaningQuality)
              , item.cleaningDurationInMins,
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

  onButtonClick(cleaningId: string) {
    this.sharedService.changeCleaningId(cleaningId);
    this.router.navigate(["/completeInfo"])
  }

  onScheduleClick(cleaning: CleaningHistoryWithName) {
    const navigateWithDelay = () => {
      setTimeout(() => {
        this.router.navigate(['/companies']);
      }, 3000);
    };

    const setItemRecursively = () => {
      var ch: CleaningHistory[] = [];
      localStorage.setItem("cleaning", JSON.stringify(cleaning));

      const item = localStorage.getItem("cleaning");
      if (item) {
        ch = JSON.parse(item);
        if (ch.length === 0) {
          setItemRecursively();
        } else {
          navigateWithDelay();
        }
      } else {
        console.log('Error: Item not found in local storage');
      }
    };

    setItemRecursively();
  }

}
