import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Feedback } from '../model/feedback.model';
import { environment } from 'src/environments/environment';
import { User } from '../model/users.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbacksService {
  private apiUrl = environment.baseUrl + 'Feedbacks';
  constructor(private http: HttpClient) {}

  saveFeedback(feedback: Feedback): Observable<Feedback | null> {
    const item = localStorage.getItem('user');
    if (item) {
      const user: User[] = JSON.parse(item);
      feedback.memberId = user[0].id;
      return this.http.post<Feedback>(this.apiUrl, feedback);
    } else {
      console.log('No user data found in localStorage');
      return of(null);
    }
  }

  getFeedback(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(this.apiUrl);
  }
}
