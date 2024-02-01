import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../model/users.model';
import { environment } from 'src/environments/environment';
import { UserSearch } from '../model/user.search.model';
import { Habit } from '../model/habit.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = environment.baseUrl + "Users/";

  constructor(private http: HttpClient) { }

  getUserByUsername(username: string): Observable<User | null> {
    return this.http.get<User>(environment.baseUrl + `username/${username}`);
  }

  getUserById(): Observable<User | null> {
    const item = localStorage.getItem('user');
    if (item) {
      const user: User[] = JSON.parse(item);
      return this.http.get<User>(this.apiUrl + `${user[0].id}`);
    } else {
      console.log('No user data found in localStorage');
      return of(null);
    }
  }

  saveUserHabit(habit: Habit): Observable<boolean | null> {
    const item = localStorage.getItem('user');
    if (item) {
      const user: User[] = JSON.parse(item);
      return this.http.put<boolean>(this.apiUrl + `${user[0].id}/habits`, habit);
    } else {
      console.log('No user data found in localStorage');
      return of(null);
    }
  }
}