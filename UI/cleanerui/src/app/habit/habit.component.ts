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

@Component({
  selector: 'app-habit',
  templateUrl: './habit.component.html',
  styleUrls: ['./habit.component.scss']
})
export class HabitComponent implements OnInit {

  constructor(private fb: FormBuilder, private userroomService: UserRoomsService,
    private userService: UserService, private roomService: RoomService) {
    this.myForm = this.fb.group({
      rooms: this.fb.array([this.createRoom()])
    });
  }

  cleaningFrequencyOptions!: { key: string; value: number; }[];
  daysOfWeekOptions!: { key: string; value: number; }[];
  surfacedTypeOptions!: { key: string; value: number; }[];
  usageFrequencyOptions!: { key: string; value: number; }[];
  roomSizeOptions!: { key: string; value: number; }[];

  userPreferences: Habit = new Habit();
  daysOfWeekType = DaysOfWeek;
  cleaningFrequencyType = CleaningFrequency;
  surfacedType = SurfaceType;
  usageFrequency = UsageFrequency;
  roomSize = RoomSize;

  myForm: FormGroup;

  createRoom(): FormGroup {
    return this.fb.group({
      room: [null, Validators.required],
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
        const roomName = roomControl.get('room')?.value;
        const roomSize = parseInt(roomControl.get('roomSize')?.value);
        const surfaceType = parseInt(roomControl.get('surfaceType')?.value);
        const usageFrequency = parseInt(roomControl.get('usageFrequency')?.value);
        const numberOfOccupants = roomControl.get('numberOfOccupants')?.value;

        console.log(this.selectedCleaningFrequencyOptions);
        if (roomName !== null) {
          this.listOfRooms.push(roomName);
        }
        var savedRoom: Rooms | null;
        this.roomService.saveRoom(new Rooms(roomName)).subscribe(
          (savedR) => {
            if (savedR === null) return;
            else {
              savedRoom = savedR;
              var userrom = new UserRoom(
                savedRoom!.id, roomSize, surfaceType, usageFrequency, numberOfOccupants
              )
              this.userroomService.saveUserRoom(userrom).subscribe(
                (data) => {
                  console.log("Success saved User Room!");
                }, (error) => {
                  console.error('Error fetching API results:', error);
                });
            }
          }
        );
      }
    })

    var habit = new Habit(
      this.getSelectedDayIds(),
      parseInt(this.selectedCleaningFrequencyOptions),
      this.listOfRooms,
      this.userPreferences.pets,
      this.userPreferences.allergies
    )
    this.userService.saveUserHabit(habit).subscribe(
      (data) => {
        console.log("Success, saved user Habits!");
      }, (error) => {
        console.error('Error fetching API results:', error);
      })
  }
}
