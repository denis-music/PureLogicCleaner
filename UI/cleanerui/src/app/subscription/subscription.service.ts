import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Subscription } from '../model/subs.model';
import { User } from '../model/users.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = 'https://localhost:7079/Subscriptions'; // Update this URL as needed
  constructor(private http: HttpClient) { }

  getSubs(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(this.apiUrl);
  }

  getUserSub(): Observable<User | null> {
    const item = localStorage.getItem('user');
    if (item) {
      const user: User[] = JSON.parse(item);
      return this.http.get<User>(`https://localhost:7079/Users/${user[0].id}`);
    } else {
      console.log('No user data found in localStorage');
      return of(null);
    }
  }

  changeUserSub(subsId: string): Observable<boolean> {
    const item = localStorage.getItem('user');
    if (item) {
      const user: User[] = JSON.parse(item);
      console.log("get user in subs", user[0]);
      return this.http.put<boolean>(`https://localhost:7079/member/${user[0].id}/subscription/${subsId}`, {});
    } else {
      console.log('No user data found in localStorage');
      return of(false);
    }
  }
}
