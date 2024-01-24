import { Component, OnInit } from '@angular/core';
import { CleaningFrequency } from '../enum/cleaningFrequency.enum';
import { DaysOfWeek } from '../enum/daysOfWeek.enum';
import { Habit } from '../model/habit.model';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-habit',
  templateUrl: './habit.component.html',
  styleUrls: ['./habit.component.scss']
})
export class HabitComponent implements OnInit {

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      rooms: this.fb.array([this.createRoom()])
    });
  }

  cleaningFrequencyOptions!: { key: string; value: number; }[];
  daysOfWeekOptions!: { key: string; value: number; }[];

  userPreferences: Habit = new Habit();
  daysOfWeekType = DaysOfWeek;
  cleaningFrequencyType = CleaningFrequency;

  myForm: FormGroup;

  get rooms(): FormArray {
    return this.myForm.get('rooms') as FormArray;
  }

  createRoom(): FormGroup {
    return this.fb.group({
      roomName: ''
    });
  }

  addRoom(): void {
    this.rooms.push(this.createRoom());
  }

  removeRoom(index: number): void {
    this.rooms.removeAt(index);
  }

  ngOnInit(): void {
    this.cleaningFrequencyOptions = Object.entries(CleaningFrequency)
      .filter(([key, value]) => !isNaN(Number(value)))
      .map(([key, value]) => ({ key: this.toFriendlyString(Number(value) as CleaningFrequency), value: Number(value) }));

    this.daysOfWeekOptions = Object.entries(this.daysOfWeekType)
      .filter(([key, value]) => !isNaN(Number(value)))
      .map(([key, value]) => ({ key, value: Number(value) }));
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

  selectedCleaningFrequencyOptions: any = 0; // This will hold the selected value
  selectedDayOfTheWeekOptions: string[] = [];

  toggleDaySelection(day: string) {
    const index = this.selectedDayOfTheWeekOptions.indexOf(day);

    if (index === -1) {
      this.selectedDayOfTheWeekOptions.push(day);
    } else {
      this.selectedDayOfTheWeekOptions.splice(index, 1);
    }
  }

  onSubmit() {
    // Implement your logic to handle the form submission
    console.log('User Preferences submitted:', this.userPreferences);
    // You can send the data to your API or perform any other actions here
  }

}
