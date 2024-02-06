import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../statistics/statistics.service';
import { CleaningHistory } from '../model/cleaningHistory.model';
import { RoomService } from '../_services/room.service';
import { CleaningHistoryWithName } from '../model/cleaningHistoryWithName.model';
import { Router } from '@angular/router';
import { SharedStateService } from '../_services/shared-state.service';
import { getCleaningQualityName } from '../enum/cleaningQuality.enum';
import { UserRoomsService } from '../_services/user-rooms.service';
import { Observable, ObservableInput, forkJoin, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-cleaning',
  templateUrl: './cleaning.component.html',
  styleUrls: ['./cleaning.component.scss']
})
export class CleaningComponent implements OnInit {

  constructor(private statisticsService: StatisticsService,
    private roomService: RoomService, private router: Router,
    private sharedService: SharedStateService,
    private userRoomService: UserRoomsService) { }

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
    const today = new Date();
    const observables: Observable<any>[] = []

    this.cleaningHistoryList.forEach((item) => {
      const itemDate = new Date(item.date);
      const userRoomObservable = this.userRoomService.getUserRoomById(item.userRoomId).pipe(
        switchMap(userRoom => {
          if (userRoom !== null) {
            return this.roomService.getRoomById(userRoom.roomId!);
          } else {
            return of(null);
          }
        }),
        map(room => {
          if (room !== null) {
            return new CleaningHistoryWithName(
              item.id, item.userRoomId,
              room.customName, item.completed,
              getCleaningQualityName(item.cleaningQuality),
              item.cleaningDurationInMins,
              item.date, item.createdAt, item.updatedAt
            );
          }
          return null;
        })
      );
      observables.push(userRoomObservable);
    });

    forkJoin(observables).subscribe(results => {
      results.forEach(itemWName => {
        if (itemWName !== null) {
          if (new Date(itemWName.date) <= today) {
            this.pastCleaningHistoryList.push(itemWName);
          } else {
            this.futureCleaningHistoryList.push(itemWName);
          }
        }
      });
      this.sortByScheduledDate();
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

  getDaysUntilCleaning(historyDate: any): number {
    const date = new Date(historyDate);
    const today = new Date();
    if (!isNaN(date.getTime())) {
      const timeDiff = date.getTime() - today.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysLeft;
    } else {
      return NaN;
    }
  }

  sortByScheduledDate(): void {
    this.futureCleaningHistoryList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    this.pastCleaningHistoryList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}
