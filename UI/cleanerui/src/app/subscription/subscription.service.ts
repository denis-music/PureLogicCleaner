import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from '../model/subs.model';
import { User } from '../model/users.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = 'https://localhost:7079/Subscriptions'; // Update this URL as needed
  constructor(private http: HttpClient) {}

  getSubs(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(this.apiUrl);
  }

  getUserSub(id: string): Observable<User> {
    return this.http.get<User>(`https://localhost:7079/Users/${id}`);
  }

  changeUserSub(userId: string, subsId: string): Observable<boolean> {
    return this.http.put<boolean>(`https://localhost:7079/member/${userId}/subscription/${subsId}`, {});
  }
}
