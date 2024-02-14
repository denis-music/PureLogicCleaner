import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from '../model/users.model';
import { CleaningHistory } from '../model/cleaningHistory.model';
import { Router } from '@angular/router';
import { Observable, switchMap, of, map, forkJoin } from 'rxjs';
import { RoomService } from '../_services/room.service';
import { SharedStateService } from '../_services/shared-state.service';
import { UserRoomsService } from '../_services/user-rooms.service';
import { getCleaningQualityName } from '../enum/cleaningQuality.enum';
import { CleaningHistoryWithName } from '../model/cleaningHistoryWithName.model';
import { StatisticsService } from '../statistics/statistics.service';
import { News } from '../model/news.model';

@Component({
  selector: 'app-user-landing',
  templateUrl: './user-landing.component.html',
  styleUrls: ['./user-landing.component.scss']
})
export class UserLandingComponent implements OnInit {

  newsItems: News[] = [];

  constructor(private http: HttpClient
    , private statisticsService: StatisticsService,
    private roomService: RoomService, private router: Router,
    private sharedService: SharedStateService,
    private userRoomService: UserRoomsService) { }

  ngOnInit(): void {
    const apiUrl = 'https://gnews.io/api/v4/top-headlines?country=us&token=f66fa10ebf43868c8546a4031414c928';
    this.http.get(apiUrl).subscribe((data: any) => {
      this.newsItems = this.shuffle(data.articles).slice(0, 5);
      if (this.newsItems.length == 0) {
        const item = localStorage.getItem('news');
        if (item && item.length > 0) {
          const news: News[] = JSON.parse(item);
          this.newsItems = news;
        }
      } else {
        localStorage.removeItem('news');
        localStorage.setItem('news', JSON.stringify(this.newsItems));
      }
    });

    this.loadUser()
    this.loadData()
  }

  private shuffle(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }

  isLogIn: boolean = true;
  user: User | undefined;
  loadUser() {
    const item = localStorage.getItem('user');
    if (item) {
      const users: User[] = JSON.parse(item);
      var user = users[0];
      this.user = user;
      this.isLogIn = true;
    } else {
      this.isLogIn = false;
    }
  }

  showWaitingMessage = false;
  cleaningHistoryList: CleaningHistory[] = [];

  loadData() {
    this.showWaitingMessage = true;
    this.cleaningHistoryList = [];
    this.statisticsService.getCleaningsForMemberByMutalRoomId().subscribe(
      (data) => {
        if (data !== null && data.length != 0) {
          this.cleaningHistoryList = data;
          this.splitHistoryLists();
        } else {
          console.error('There is no data');
          this.showWaitingMessage = false;
        }
      },
      (error) => {
        console.error('Error fetching API results:', error);
      });
  }

  futureCleaningHistoryList: CleaningHistoryWithName[] = [];
  fullCleaningHistoryList: CleaningHistoryWithName[] = [];

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
          this.fullCleaningHistoryList.push(itemWName)
          if (new Date(itemWName.date) > today) {
            this.futureCleaningHistoryList.push(itemWName);
            this.showWaitingMessage = false;
          }
        }
      });
      this.sortByScheduledDate();
      this.updateChartData()
    });
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
  }

  onCardClick() {
    this.router.navigate(["cleaning"])
  }

  public pieChartData: any;

  updateChartData() {
    const data = this.fullCleaningHistoryList.map(x => new Date(x.date).toDateString());

    this.pieChartData = {
      labels: data,
      datasets: [
        {
          backgroundColor: ['green', 'red'],
          label: 'Cleaning Completion Statuses ' +
            '(0 as Not Completed and 1 as Completed)',
        },
      ],
    };
    this.pieChartData.datasets[0].data = this.fullCleaningHistoryList.map(x => x.completed);

    if (this.futureCleaningHistoryList.length == 0) {
      this.showWaitingMessage = false;
    }
  }
}
