import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Subscription } from '../model/subs.model';
import { User } from '../model/users.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = environment.baseUrl + 'Subscriptions';
  constructor(private http: HttpClient) { }

  getSubs(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(this.apiUrl);
  }

  changeUserSub(subsId: string): Observable<boolean> {
    const item = localStorage.getItem('user');
    if (item) {
      const user: User[] = JSON.parse(item);
      console.log("get user in subs", user[0]);
      return this.http.put<boolean>(environment.baseUrl + `member/${user[0].id}/subscription/${subsId}`, {});
    } else {
      console.log('No user data found in localStorage');
      return of(false);
    }
  }
}
