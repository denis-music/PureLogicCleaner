import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {

  constructor() { }

  private userWHabitsSource = new BehaviorSubject<boolean>(false);
  userWHabits = this.userWHabitsSource.asObservable();

  private cleaningIdSource = new BehaviorSubject<string | null>(null);
  currentCleaningId = this.cleaningIdSource.asObservable();

  setUserWHabits(value: boolean) {
    this.userWHabitsSource.next(value);
  }

  changeCleaningId(id: string) {
    this.cleaningIdSource.next(id);
  }
}
