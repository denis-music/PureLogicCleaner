import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../statistics/statistics.service';
import { CleaningHistory } from '../model/cleaningHistory.model';

@Component({
  selector: 'app-cleaning',
  templateUrl: './cleaning.component.html',
  styleUrls: ['./cleaning.component.scss']
})
export class CleaningComponent implements OnInit {

  constructor(private statisticsService: StatisticsService) { }

  showWaitingMessage = false;

  cleaningHistoryList: CleaningHistory[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.cleaningHistoryList  = [];
    this.statisticsService.getCleaningStatus().subscribe(
      (data) => {
        this.cleaningHistoryList = data;
        this.splitHistoryLists();
      },
      (error) => {
        console.error('Error fetching API results:', error);
      });
  }

  pastCleaningHistoryList: CleaningHistory[] = [];
  futureCleaningHistoryList: CleaningHistory[] = [];
  splitHistoryLists(): void {
    this.pastCleaningHistoryList = [];
    this.futureCleaningHistoryList = [];
    const today = new Date();

    this.cleaningHistoryList.forEach((item) => {
      const itemDate = new Date(item.date);

      if (itemDate <= today) {
        // Date is today or in the past
        this.pastCleaningHistoryList.push(item);
      } else if (itemDate > today) {
        // Date is in the future
        this.futureCleaningHistoryList.push(item);
      }
    });
  }

  onButtonClick(cleaning: CleaningHistory) {
    this.showWaitingMessage = true;

      this.statisticsService.changeCleaningStatus(cleaning.id).subscribe(
        (result) => {
        this.loadData();
        this.showWaitingMessage = false;
        },(error) => {
        this.showWaitingMessage = false;
      });
  }

}
