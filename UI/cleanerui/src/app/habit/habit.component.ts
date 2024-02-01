import { Component, OnInit } from '@angular/core';
import { CleaningFrequency } from '../enum/cleaningFrequency.enum';
import { DaysOfWeek } from '../enum/daysOfWeek.enum';
import { Habit } from '../model/habit.model';
import { FormGroup, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserRoomsService } from '../_services/user-rooms.service';
import { UserRoom } from '../model/userRoom.model';
import { error } from 'console';
import { UserService } from '../_services/user.service';
import { RoomService } from '../_services/room.service';
import { Rooms } from '../model/rooms.model';
import { SurfaceType } from '../enum/surfaceType.enum';
import { UsageFrequency } from '../enum/usageFrequency.enum';
import { RoomSize } from '../enum/roomSize.enum';
import { Router } from '@angular/router';
import { UserStateService } from '../_services/user-state.service';
import { AuthService } from '../_services/auth.service';
import { User } from '../model/users.model';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-habit',
  templateUrl: './habit.component.html',
  styleUrls: ['./habit.component.scss']
})
export class HabitComponent implements OnInit {

  constructor(private fb: FormBuilder, private userroomService: UserRoomsService,
    private userService: UserService, private roomService: RoomService,
    private router: Router, private userStateService: UserStateService,
    private authService: AuthService, private alertifyService: AlertifyService) {
    this.myForm = this.fb.group({
      rooms: this.fb.array([this.createRoom()])
    });
  }

  cleaningFrequencyOptions!: { key: string; value: number; }[];
  daysOfWeekOptions!: { key: string; value: number; }[];
  surfacedTypeOptions!: { key: string; value: number; }[];
  usageFrequencyOptions!: { key: string; value: number; }[];
  roomSizeOptions!: { key: string; value: number; }[];
  roomLabelOptions!: { key: string; value: number; }[];

  userPreferences: Habit = new Habit();
  daysOfWeekType = DaysOfWeek;
  cleaningFrequencyType = CleaningFrequency;
  surfacedType = SurfaceType;
  usageFrequency = UsageFrequency;
  roomSize = RoomSize;
  roomLabel: string[] = [
    'Kitchen',
    'Living Room',
    'Bathroom',
    'Bedroom',
    'Dining Room',
    'Study',
    'Hallway',
    'Garage'
  ];

  myForm: FormGroup;

  createRoom(): FormGroup {
    return this.fb.group({
      room: [null, Validators.required],
      roomLabel: [null, Validators.required],
      roomSize: [null, Validators.required],
      surfaceType: [null, Validators.required],
      usageFrequency: [null, Validators.required],
      numberOfOccupants: [null, Validators.required]
    });
  }

  addRoom(): void {
    this.rooms.push(this.createRoom());
  }

  removeRoom(index: number): void {
    this.rooms.removeAt(index);
  }

  get rooms(): FormArray {
    return this.myForm.get('rooms') as FormArray;
  }

  ngOnInit(): void {
    const item = localStorage.getItem('user');
    if (item) {
      const users: User[] = JSON.parse(item);
      var user = users[0];
      if (user.preferredCleaningDays == null ||
        user.preferredCleaningFrequency == null ||
        user.allergies == null || user.pets == null ||
        user.priorityRoomIds == null ||
        user.priorityRoomIds.length === 0 ||
        user.preferredCleaningDays.length === 0) {
      }
      else {
        this.router.navigate(['/home'])
      }
    }

    this.cleaningFrequencyOptions = Object.entries(CleaningFrequency)
      .filter(([key, value]) => !isNaN(Number(value)))
      .map(([key, value]) => ({ key: this.toFriendlyString(Number(value) as CleaningFrequency), value: Number(value) }));

    this.daysOfWeekOptions = Object.entries(this.daysOfWeekType)
      .filter(([key, value]) => !isNaN(Number(value)))
      .map(([key, value]) => ({ key, value: Number(value) }));

    this.surfacedTypeOptions = Object.entries(this.surfacedType)
      .filter(([key, value]) => !isNaN(Number(value)))
      .map(([key, value]) => ({ key, value: Number(value) }));

    this.usageFrequencyOptions = Object.entries(this.usageFrequency)
      .filter(([key, value]) => !isNaN(Number(value)))
      .map(([key, value]) => ({ key, value: Number(value) }));

    this.roomSizeOptions = Object.entries(this.roomSize)
      .filter(([key, value]) => !isNaN(Number(value)))
      .map(([key, value]) => ({ key, value: Number(value) }));

    this.userPreferences.allergies = false;
    this.userPreferences.pets = false;
  }

  toFriendlyString(frequency: CleaningFrequency): string {
    switch (frequency) {
      case CleaningFrequency.Daily:
        return 'Daily';
      case CleaningFrequency.EveryThreeDays:
        return 'Every 3 Days';
      case CleaningFrequency.TwiceAWeek:
        return 'Twice a Week';
      case CleaningFrequency.Weekly:
        return 'Weekly';
      case CleaningFrequency.Fortnightly:
        return 'Fortnightly';
      case CleaningFrequency.BiWeekly:
        return 'Bi-Weekly';
      case CleaningFrequency.TwiceAMonth:
        return 'Twice a Month';
      case CleaningFrequency.Monthly:
        return 'Monthly';
      case CleaningFrequency.BiMonthly:
        return 'Bi-Monthly';
      case CleaningFrequency.Quarterly:
        return 'Quarterly';
      case CleaningFrequency.Seasonally:
        return 'Seasonally';
      case CleaningFrequency.Yearly:
        return 'Yearly';
      case CleaningFrequency.AsNeeded:
        return 'As Needed';
      default:
        throw new Error(`Invalid CleaningFrequency: ${frequency}`);
    }
  }

  selectedCleaningFrequencyOptions: any = 0;
  selectedDayOfTheWeekOptions: number[] = [];

  toggleDaySelection(dayValue: number) {
    const index = this.selectedDayOfTheWeekOptions.indexOf(dayValue);

    if (index === -1) {
      this.selectedDayOfTheWeekOptions.push(dayValue);
    } else {
      this.selectedDayOfTheWeekOptions.splice(index, 1);
    }
  }

  getSelectedDayIds() {
    return this.selectedDayOfTheWeekOptions;
  }

  listOfRooms: string[] = [];

  onSubmit() {
    const formArray = this.myForm.get('rooms') as FormArray;

    formArray.controls.forEach((roomControl: AbstractControl) => {
      if (roomControl instanceof FormGroup) {
        const customRoomName = roomControl.get('room')?.value;
        const roomSize = parseInt(roomControl.get('roomSize')?.value);
        const surfaceType = parseInt(roomControl.get('surfaceType')?.value);
        const usageFrequency = parseInt(roomControl.get('usageFrequency')?.value);
        const numberOfOccupants = roomControl.get('numberOfOccupants')?.value;
        const roomLabel = roomControl.get('roomLabel')?.value;

        var savedRoom: Rooms | null;
        this.roomService.saveRoom(new Rooms(roomLabel, customRoomName)).subscribe(
          (savedR) => {
            if (savedR === null) return;
            else {
              savedRoom = savedR;
              var userroom = new UserRoom(
                savedRoom!.id, roomSize, surfaceType, usageFrequency, numberOfOccupants
              )
              this.userroomService.saveUserRoom(userroom).subscribe(
                (data) => {
                  console.log("Success saved User Room!");
                  this.listOfRooms.push(savedRoom!.id);
                }, (error) => {
                  console.error('Error fetching API results:', error);
                });
            }
          }
        );
      }
    })


    setTimeout(() => {
      var habit = new Habit(
        this.getSelectedDayIds(),
        parseInt(this.selectedCleaningFrequencyOptions),
        this.listOfRooms,
        this.userPreferences.pets,
        this.userPreferences.allergies
      )
      this.userService.saveUserHabit(habit).subscribe(
        (data) => {
          this.alertifyService.successAlert("User preferences Added!")
          this.userStateService.setUserWHabits(true);
          const item = localStorage.getItem('user');
          if (item) {
            const users: User[] = JSON.parse(item);
            var user = users[0];
            this.authService.saveUser(user.username);
            setTimeout(() => {
              this.router.navigate(['/home'])
            }, 3000);
          }
        }, (error) => {
          this.alertifyService.errorAlert("Error in adding user preferences, please try again!")
          console.error('Error fetching API results:', error);
        })
    }, 6000);

  }

  close() {
    this.router.navigate(['/login'])
  }
}
