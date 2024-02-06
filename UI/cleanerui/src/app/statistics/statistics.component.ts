import { Component, AfterViewInit } from '@angular/core';
import { StatisticsService } from './statistics.service';
import { UserRoomsService } from '../_services/user-rooms.service';
import { RoomService } from '../_services/room.service';
import { StatsView } from '../model/stats.view.model';
import { CleaningHistoryWithName } from '../model/cleaningHistoryWithName.model';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})

export class StatisticsComponent implements AfterViewInit {

  public doughnutData: Object[] = [
    { x: 'Completed', y: 60 },
    { x: 'Not Completed', y: 40 }
  ];

  public primaryXAxis: Object = { valueType: 'Category' };
  public title: string = 'Completion Status Circular Chart';

  selectedCleaningType: string = '';
  optionList: StatsView[] = [];
  doughnutChartData: number[] = [];
  doughnutChartLabels: string[] = ['Completed', 'Not Completed'];
  chartOptions = {
    responsive: true,
  };
  isDataNeverLoaded: boolean = false;
  constructor(private statisticsService: StatisticsService,
    private userRoomsService: UserRoomsService, private roomService: RoomService) { }

  ngAfterViewInit() {
    this.loadData();
    this.createChartGauge();
  }

  private getCompletedRoomsPercentage(): number {
    //return Math.floor(Math.random() * (max - min + 1) + min)

    this.isDataNeverLoaded = true;
    this.apiResults = [];
    if (this.selectedCleaningType) {
      this.statisticsService.getCleaningsForMemberByMutalRoomId().subscribe(
        (results) => {
          if (results !== null) {
            results.forEach((item) => {
              if (item.userRoomId == this.selectedCleaningType && item.completed == true) {
                var roomName = this.optionList.find(p => p.userRoomId == item.userRoomId)
                var model = new CleaningHistoryWithName(
                  item.id,
                  item.userRoomId,
                  roomName!.roomName, item.completed, "item.cleaningQuality"
                  , item.cleaningDurationInMins, item.date,
                  item.createdAt, item.updatedAt
                )
                this.apiResults.push(model);
                this.isDataNeverLoaded = false;
              }
            })
          }
        }
      );
    }
    return this.apiResults.length;   
  }

  private createChartGauge(): void {
    const chart = Highcharts.chart('chart-gauge', 
    {
      chart: {
        type: 'solidgauge',
      },
      title: {
        text: 'Gauge Chart',
      },
      credits: {
        enabled: false,
      },
      pane: {
        startAngle: -90,
        endAngle: 90,
        center: ['50%', '85%'],
        size: '160%',
        background: {
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc',
        },
      },
      yAxis: {
        min: 0,
        max: 100,
        stops: [
          [0.1, '#DF5353'], // green
          [0.5, '#DDDF0D'], // yellow
          [0.9, '#55BF3B'], // red 
        ],
        minorTickInterval: null,
        tickAmount: 2,
        labels: {
          y: 16,
        },
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: -25,
            borderWidth: 0,
            useHTML: true,
          },
        },
      },
      tooltip: {
        enabled: false,
      },
      series: [{
        name: null,
        data: [this.getCompletedRoomsPercentage()],
        dataLabels: {
          format: '<div style="text-align: center"><span style="font-size: 1.25rem">{y}</span></div>',
        },
      }],
    } as any);

    console.log("here")

    // setInterval(() => {
    //   chart.series[0].points[0].update(this.getRandomNumber(0, 100));
    // }, 1000);
  }

  private loadData() {
    this.userRoomsService.getUserRooms().subscribe(
      (userRooms) => {
        if (userRooms !== null) {
          userRooms.forEach(userRoom => {
            this.roomService.getRoomById(userRoom.roomId!).subscribe(
              (room) => {
                var model = new StatsView(
                  userRoom.id!,
                  room.id,
                  room.customName
                )
                this.optionList.push(model);
              },
              (error) => {
                console.error('Error fetching data:', error);
              }
            );
          });
        }
      }
    );



  }
  apiResults: CleaningHistoryWithName[] = [];

  onButtonClick() {
    this.isDataNeverLoaded = true;
    this.apiResults = [];
    if (this.selectedCleaningType) {
      this.statisticsService.getCleaningsForMemberByMutalRoomId().subscribe(
        (results) => {
          if (results !== null) {
            results.forEach((item) => {
              if (item.userRoomId == this.selectedCleaningType) {
                var roomName = this.optionList.find(p => p.userRoomId == item.userRoomId)
                var model = new CleaningHistoryWithName(
                  item.id,
                  item.userRoomId,
                  roomName!.roomName, item.completed, "item.cleaningQuality"
                  , item.cleaningDurationInMins, item.date,
                  item.createdAt, item.updatedAt
                )
                this.apiResults.push(model);
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
