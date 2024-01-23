import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback } from '../model/feedback.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbacksService {
  private apiUrl = 'https://localhost:7079/Feedbacks'; // Update this URL as needed
  constructor(private http: HttpClient) {}

  saveFeedback(feedback: Feedback): Observable<Feedback> {
    console.log("here", feedback);
    return this.http.post<Feedback>(this.apiUrl, feedback);
  }

  getFeedback(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(this.apiUrl);
  }
}
