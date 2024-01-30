import { Component, OnInit } from '@angular/core';
import { StatisticsService } from './statistics.service';
import { UserRoomsService } from '../_services/user-rooms.service';
import { RoomService } from '../_services/room.service';
import { StatsView } from '../model/stats.view.model';
import { CleaningHistoryWithName } from '../model/cleaningHistoryWithName.model';

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
  optionList: StatsView[] = [];
  doughnutChartData: number[] = [];
  doughnutChartLabels: string[] = ['Completed', 'Not Completed'];
  chartOptions = {
    responsive: true,
  };
  isDataNeverLoaded: boolean = false;
  constructor(private statisticsService: StatisticsService,
    private userRoomsService: UserRoomsService, private roomService: RoomService) { }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.userRoomsService.getUserRooms().subscribe(
      (userRooms) => {
        if (userRooms !== null) {
          userRooms.forEach(userRoom => {
            this.roomService.getRoomById(userRoom.roomId!).subscribe(
              (room) => {
                var model = new StatsView(
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
                var roomName = this.optionList.find( p => p.roomId == item.userRoomId)
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
