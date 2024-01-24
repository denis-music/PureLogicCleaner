import { Component, OnInit } from '@angular/core';
import { StatisticsService } from './statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  public doughnutData: Object[] = [
    { x: 'Completed', y: 60 },
    { x: 'Not Completed', y: 40 }
  ];

  public primaryXAxis: Object = { valueType: 'Category' };
  public title: string = 'Completion Status Circular Chart';

  selectedCleaningType: string = 'cleaned';
  optionList: string[] = [];
  doughnutChartData: number[] = [];
  doughnutChartLabels: string[] = ['Completed', 'Not Completed'];
  chartOptions = {
    responsive: true,
  };
  isDataNeverLoaded: boolean = false;
  constructor(private statisticsService: StatisticsService) { }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.statisticsService.getCleaningType().subscribe(
      (data) => {
        data.forEach((item) => {
          this.optionList.push(item.name);
        });
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  apiResults: any[] = [];

  onButtonClick() {
    this.isDataNeverLoaded = true;
    this.apiResults = [];
    if (this.selectedCleaningType) {
      this.statisticsService.getCleaningStatus().subscribe(
        (results) => {
          if (results !== null) {
            results.forEach((item) => {
              if (item.userRoomId == this.selectedCleaningType) {
                this.apiResults.push(item);
                this.isDataNeverLoaded = false;
              }
            })
          }
          else {
            console.error('No cleaning history API results:');
          }
        },
        (error) => {
          console.error('Error fetching API results:', error);
        }
      );
    }
  }
}
