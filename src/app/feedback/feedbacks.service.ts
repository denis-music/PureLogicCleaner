import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback } from '../model/feedback.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbacksService {
  private apiUrl = environment.baseUrl + 'Feedbacks';
  constructor(private http: HttpClient) {}

  saveFeedback(feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(this.apiUrl, feedback);
  }

  getFeedback(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(this.apiUrl);
  }
}
